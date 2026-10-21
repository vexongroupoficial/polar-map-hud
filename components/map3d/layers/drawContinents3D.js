import * as THREE from 'three';
import { latLonToPolar } from '@/lib/polarMath';

/**
 * Calcula el área firmada de un polígono 2D.
 * Garantiza la orientación correcta de los contornos para Three.js
 */
function getSignedArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return area / 2;
}

export function createContinentsLayer(countriesData, mapRadius = 4.5) {
  const group = new THREE.Group();
  if (!countriesData || !countriesData.features) return group;

  countriesData.features.forEach((feature) => {
    const props = feature.properties || {};

    // Excluir Antártida (se renderiza limpia como el anillo perimetral azul en drawOcean3D)
    const isAntarctica =
      props.ISO_A3 === 'ATA' ||
      props.ADMIN === 'Antarctica' ||
      props.NAME === 'Antarctica' ||
      props.CONTINENT === 'Antarctica' ||
      feature.id === 'ATA';

    if (isAntarctica) return;

    const coords = feature.geometry?.coordinates;
    const type = feature.geometry?.type;

    const renderPolygon = (rings) => {
      if (!rings || rings.length === 0) return;

      const outerRing = rings[0];
      if (!outerRing || outerRing.length < 3) return;

      let outerPoints = outerRing
        .map(([lon, lat]) => {
          if (isNaN(lon) || isNaN(lat)) return null;
          const p = latLonToPolar(lat, lon, mapRadius, 0);
          return { x: p.x, y: -p.y };
        })
        .filter(Boolean);

      if (outerPoints.length < 3) return;

      // Garantizar sentido Antihorario (CCW) para contornos exteriores
      if (getSignedArea(outerPoints) < 0) {
        outerPoints.reverse();
      }

      const shape = new THREE.Shape();
      shape.moveTo(outerPoints[0].x, outerPoints[0].y);
      for (let i = 1; i < outerPoints.length; i++) {
        shape.lineTo(outerPoints[i].x, outerPoints[i].y);
      }

      // Anillos interiores (Huecos / Lagos)
      for (let h = 1; h < rings.length; h++) {
        const holeRing = rings[h];
        if (!holeRing || holeRing.length < 3) continue;

        let holePoints = holeRing
          .map(([lon, lat]) => {
            if (isNaN(lon) || isNaN(lat)) return null;
            const p = latLonToPolar(lat, lon, mapRadius, 0);
            return { x: p.x, y: -p.y };
          })
          .filter(Boolean);

        if (holePoints.length < 3) continue;

        // Sentido Horario (CW) para orificios en THREE.Shape
        if (getSignedArea(holePoints) > 0) {
          holePoints.reverse();
        }

        const holePath = new THREE.Path();
        holePath.moveTo(holePoints[0].x, holePoints[0].y);
        for (let i = 1; i < holePoints.length; i++) {
          holePath.lineTo(holePoints[i].x, holePoints[i].y);
        }
        shape.holes.push(holePath);
      }

      try {
        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: 0.05,
          bevelEnabled: true,
          bevelSegments: 1,
          steps: 1,
          bevelSize: 0.008,
          bevelThickness: 0.008,
        });

        const mat = new THREE.MeshStandardMaterial({
          color: 0x0f172a, // Azul pizarra para masas continentales
          roughness: 0.85,
          metalness: 0.1,
        });

        const mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);
      } catch (e) {
        // Omisión silenciosa de triangulaciones complejas
      }
    };

    if (type === 'Polygon') {
      renderPolygon(coords);
    } else if (type === 'MultiPolygon') {
      coords.forEach((poly) => renderPolygon(poly));
    }
  });

  return group;
}
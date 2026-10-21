import * as THREE from 'three';
import { latLonToPolar } from '@/lib/polarMath';

function getSignedArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return area / 2;
}

export function createReliefLayer(reliefData, mapRadius = 4.5) {
  const group = new THREE.Group();
  if (!reliefData || !reliefData.features) return group;

  reliefData.features.forEach((feature) => {
    const props = feature.properties || {};

    const isAntarctica =
      props.ISO_A3 === 'ATA' ||
      props.ADMIN === 'Antarctica' ||
      props.NAME === 'Antarctica' ||
      props.CONTINENT === 'Antarctica' ||
      feature.id === 'ATA';

    if (isAntarctica) return;

    // FILTRAR ESTRICTAMENTE SOLO CORDILLERAS Y MONTAÑAS (Igual que en el visor 2D)
    const featureType = (props.featurecla || props.type || props.name || '').toLowerCase();
    const isMountain =
      featureType.includes('sierra') ||
      featureType.includes('range') ||
      featureType.includes('plateau') ||
      featureType.includes('mountains') ||
      featureType.includes('mountain') ||
      featureType.includes('hill');

    if (!isMountain) return;

    const coords = feature.geometry?.coordinates;
    const type = feature.geometry?.type;

    const renderReliefPolygon = (rings) => {
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

      if (getSignedArea(outerPoints) < 0) {
        outerPoints.reverse();
      }

      const shape = new THREE.Shape();
      shape.moveTo(outerPoints[0].x, outerPoints[0].y);
      for (let i = 1; i < outerPoints.length; i++) {
        shape.lineTo(outerPoints[i].x, outerPoints[i].y);
      }

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
        const mountainHeight = 0.08 + Math.random() * 0.06;
        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: mountainHeight,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.01,
          bevelThickness: 0.01,
        });

        const mat = new THREE.MeshStandardMaterial({
          color: 0x10b981, // Verde esmeralda topográfico solo para elevaciones
          roughness: 0.6,
          metalness: 0.1,
        });

        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.z = 0.05; // Elevado sobre el nivel continental
        group.add(mesh);
      } catch (e) {
        // Omisión silenciosa
      }
    };

    if (type === 'Polygon') {
      renderReliefPolygon(coords);
    } else if (type === 'MultiPolygon') {
      coords.forEach((poly) => renderReliefPolygon(poly));
    }
  });

  return group;
}
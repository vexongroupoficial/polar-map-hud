// components/hud/useWidgetStore.js
import { create } from 'zustand';

export const useWidgetStore = create((set) => ({
  widgets: {
    layersControl: {
      id: 'layersControl',
      title: 'Control de Capas',
      visible: true,
      isCollapsed: false,
      x: 20,          // Esquina Superior Izquierda
      y: 60,
      zIndex: 20,
    },
    telemetry: {
      id: 'telemetry',
      title: 'Telemetría Geodésica',
      visible: true,
      isCollapsed: false,
      x: 20,          // Abajo del Control de Capas
      y: 400,
      zIndex: 10,
    },
    erasHUD: {
      id: 'erasHUD',
      title: '12 Eras Precesionales',
      visible: false, // Inicia oculto para mantener despejado el visor
      isCollapsed: false,
      x: 320,
      y: 60,
      zIndex: 15,
    },
    navigation2D: {
      id: 'navigation2D',
      title: 'Navegación 2D',
      visible: true,
      isCollapsed: false,
      x: 1200,        // Esquina Superior Derecha
      y: 60,
      zIndex: 20,
    },
    luminaries: {
      id: 'luminaries',
      title: 'Simulador de Luminarias',
      visible: true,
      isCollapsed: false,
      x: 1180,        // Esquina Inferior Derecha
      y: 520,
      zIndex: 20,
    },
    polarCoords: {
      id: 'polarCoords',
      title: 'Coordenadas Polares',
      visible: true,
      isCollapsed: false,
      x: 20,          // Esquina Inferior Izquierda
      y: 620,
      zIndex: 10,
    },
  },
  maxZIndex: 30,

  toggleVisibility: (id) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: {
          ...state.widgets[id],
          visible: !state.widgets[id]?.visible,
        },
      },
    })),

  toggleCollapse: (id) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: {
          ...state.widgets[id],
          isCollapsed: !state.widgets[id]?.isCollapsed,
        },
      },
    })),

  updatePosition: (id, x, y) =>
    set((state) => ({
      widgets: {
        ...state.widgets,
        [id]: {
          ...state.widgets[id],
          x,
          y,
        },
      },
    })),

  bringToFront: (id) =>
    set((state) => {
      const newZ = state.maxZIndex + 1;
      return {
        maxZIndex: newZ,
        widgets: {
          ...state.widgets,
          [id]: {
            ...state.widgets[id],
            zIndex: newZ,
          },
        },
      };
    }),

  resetLayout: () =>
    set(() => ({
      widgets: {
        layersControl: { id: 'layersControl', title: 'Control de Capas', visible: true, isCollapsed: false, x: 20, y: 60, zIndex: 20 },
        telemetry: { id: 'telemetry', title: 'Telemetría Geodésica', visible: true, isCollapsed: false, x: 20, y: 400, zIndex: 10 },
        erasHUD: { id: 'erasHUD', title: '12 Eras Precesionales', visible: false, isCollapsed: false, x: 320, y: 60, zIndex: 15 },
        navigation2D: { id: 'navigation2D', title: 'Navegación 2D', visible: true, isCollapsed: false, x: 1200, y: 60, zIndex: 20 },
        luminaries: { id: 'luminaries', title: 'Simulador de Luminarias', visible: true, isCollapsed: false, x: 1180, y: 520, zIndex: 20 },
        polarCoords: { id: 'polarCoords', title: 'Coordenadas Polares', visible: true, isCollapsed: false, x: 20, y: 620, zIndex: 10 },
      },
      maxZIndex: 30,
    })),
}));

export default useWidgetStore;
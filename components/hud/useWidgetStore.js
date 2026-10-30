// components/hud/useWidgetStore.js
import { create } from 'zustand';

const DEFAULT_WIDGETS = {
  city: {
    id: 'city',
    title: 'Buscar Ciudad / Aeropuerto',
    visible: false,
    isCollapsed: false,
    x: 340,
    y: 60,
    zIndex: 25,
  },
  telemetry: {
    id: 'telemetry',
    title: 'Telemetría Geodésica',
    visible: false,
    isCollapsed: false,
    x: 340,
    y: 220,
    zIndex: 10,
  },
  polarCoords: {
    id: 'polarCoords',
    title: 'Coordenadas Polares',
    visible: false,
    isCollapsed: false,
    x: 340,
    y: 440,
    zIndex: 10,
  },
  navigation2D: {
    id: 'navigation2D',
    title: 'Consola de Navegación 2D',
    visible: false,
    isCollapsed: false,
    x: 720,
    y: 60,
    zIndex: 20,
  },
  luminaries: {
    id: 'luminaries',
    title: 'Simulador de Luminarias',
    visible: false,
    isCollapsed: false,
    x: 720,
    y: 380,
    zIndex: 20,
  },
  erasHUD: {
    id: 'erasHUD',
    title: '12 Eras PrecesIONALES',
    visible: false,
    isCollapsed: false,
    x: 340,
    y: 60,
    zIndex: 15,
  },
};

export const useWidgetStore = create((set, get) => ({
  widgets: DEFAULT_WIDGETS,
  maxZIndex: 30,

  isWidgetOpen: (id) => {
    const widget = get().widgets[id];
    if (typeof widget === 'boolean') return widget;
    return !!widget?.visible;
  },

  toggleWidget: (id) =>
    set((state) => {
      const current = state.widgets[id];
      if (!current) return state;
      const nextVisible = !current.visible;

      let updatedX = current.x;
      let updatedY = current.y;

      // Auto-centrado en móvil solo cuando el usuario interactúa dinámicamente en el navegador
      if (typeof window !== 'undefined' && window.innerWidth < 768 && nextVisible) {
        updatedX = Math.max(10, Math.floor((window.innerWidth - 320) / 2));
        updatedY = 70;
      }

      return {
        widgets: {
          ...state.widgets,
          [id]: { ...current, visible: nextVisible, x: updatedX, y: updatedY },
        },
      };
    }),

  closeWidget: (id) =>
    set((state) => {
      const current = state.widgets[id];
      if (!current) return state;
      return {
        widgets: {
          ...state.widgets,
          [id]: { ...current, visible: false },
        },
      };
    }),

  openWidget: (id) =>
    set((state) => {
      const current = state.widgets[id];
      if (!current) return state;
      return {
        widgets: {
          ...state.widgets,
          [id]: { ...current, visible: true },
        },
      };
    }),

  updatePosition: (id, x, y) =>
    set((state) => {
      const current = state.widgets[id];
      if (!current) return state;
      return {
        widgets: {
          ...state.widgets,
          [id]: { ...current, x, y },
        },
      };
    }),

  bringToFront: (id) =>
    set((state) => {
      const current = state.widgets[id];
      if (!current) return state;
      const newZ = state.maxZIndex + 1;
      return {
        maxZIndex: newZ,
        widgets: {
          ...state.widgets,
          [id]: { ...current, zIndex: newZ },
        },
      };
    }),

  resetWidgets: () =>
    set(() => ({
      widgets: JSON.parse(JSON.stringify(DEFAULT_WIDGETS)),
      maxZIndex: 30,
    })),
}));

export default useWidgetStore;
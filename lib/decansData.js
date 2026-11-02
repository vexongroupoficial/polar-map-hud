// lib/decansData.js

export const ZODIAC_DECANS = [
  // ARIES (Casa I: 0° - 30°)
  { id: 1, label: 'D1', sign: 'ARIES I', planet: 'Marte', startDeg: 0, endDeg: 10, color: '#ef4444' },
  { id: 2, label: 'D2', sign: 'ARIES II', planet: 'Sol', startDeg: 10, endDeg: 20, color: '#ef4444' },
  { id: 3, label: 'D3', sign: 'ARIES III', planet: 'Venus', startDeg: 20, endDeg: 30, color: '#ef4444' },

  // TAURO (Casa II: 30° - 60°)
  { id: 4, label: 'D4', sign: 'TAURO I', planet: 'Venus', startDeg: 30, endDeg: 40, color: '#f59e0b' },
  { id: 5, label: 'D5', sign: 'TAURO II', planet: 'Mercurio', startDeg: 40, endDeg: 50, color: '#f59e0b' },
  { id: 6, label: 'D6', sign: 'TAURO III', planet: 'Luna', startDeg: 50, endDeg: 60, color: '#f59e0b' },

  // GÉMINIS (Casa III: 60° - 90°)
  { id: 7, label: 'D7', sign: 'GÉMINIS I', planet: 'Mercurio', startDeg: 60, endDeg: 70, color: '#eab308' },
  { id: 8, label: 'D8', sign: 'GÉMINIS II', planet: 'Venus', startDeg: 70, endDeg: 80, color: '#eab308' },
  { id: 9, label: 'D9', sign: 'GÉMINIS III', planet: 'Saturno', startDeg: 80, endDeg: 90, color: '#eab308' },

  // CÁNCER (Casa IV / IC: 90° - 120°)
  { id: 10, label: 'D10', sign: 'CÁNCER I', planet: 'Venus', startDeg: 90, endDeg: 100, color: '#10b981' },
  { id: 11, label: 'D11', sign: 'CÁNCER II', planet: 'Mercurio', startDeg: 100, endDeg: 110, color: '#10b981' },
  { id: 12, label: 'D12', sign: 'CÁNCER III', planet: 'Luna', startDeg: 110, endDeg: 120, color: '#10b981' },

  // LEO (Casa V: 120° - 150°)
  { id: 13, label: 'D13', sign: 'LEO I', planet: 'Saturno', startDeg: 120, endDeg: 130, color: '#06b6d4' },
  { id: 14, label: 'D14', sign: 'LEO II', planet: 'Júpiter', startDeg: 130, endDeg: 140, color: '#06b6d4' },
  { id: 15, label: 'D15', sign: 'LEO III', planet: 'Marte', startDeg: 140, endDeg: 150, color: '#06b6d4' },

  // VIRGO (Casa VI: 150° - 180°)
  { id: 16, label: 'D16', sign: 'VIRGO I', planet: 'Sol', startDeg: 150, endDeg: 160, color: '#38bdf8' },
  { id: 17, label: 'D17', sign: 'VIRGO II', planet: 'Venus', startDeg: 160, endDeg: 170, color: '#38bdf8' },
  { id: 18, label: 'D18', sign: 'VIRGO III', planet: 'Mercurio', startDeg: 170, endDeg: 180, color: '#38bdf8' },

  // LIBRA (Casa VII / DSC: 180° - 210°)
  { id: 19, label: 'D19', sign: 'LIBRA I', planet: 'Luna', startDeg: 180, endDeg: 190, color: '#3b82f6' },
  { id: 20, label: 'D20', sign: 'LIBRA II', planet: 'Saturno', startDeg: 190, endDeg: 200, color: '#3b82f6' },
  { id: 21, label: 'D21', sign: 'LIBRA III', planet: 'Júpiter', startDeg: 200, endDeg: 210, color: '#3b82f6' },

  // ESCORPIO (Casa VIII: 210° - 240°)
  { id: 22, label: 'D22', sign: 'ESCORPIO I', planet: 'Marte', startDeg: 210, endDeg: 220, color: '#6366f1' },
  { id: 23, label: 'D23', sign: 'ESCORPIO II', planet: 'Sol', startDeg: 220, endDeg: 230, color: '#6366f1' },
  { id: 24, label: 'D24', sign: 'ESCORPIO III', planet: 'Venus', startDeg: 230, endDeg: 240, color: '#6366f1' },

  // SAGITARIO (Casa IX: 240° - 270°)
  { id: 25, label: 'D25', sign: 'SAGITARIO I', planet: 'Mercurio', startDeg: 240, endDeg: 250, color: '#a855f7' },
  { id: 26, label: 'D26', sign: 'SAGITARIO II', planet: 'Luna', startDeg: 250, endDeg: 260, color: '#a855f7' },
  { id: 27, label: 'D27', sign: 'SAGITARIO III', planet: 'Saturno', startDeg: 260, endDeg: 270, color: '#a855f7' },

  // CAPRICORNIO (Casa X / MC: 270° - 300°)
  { id: 28, label: 'D28', sign: 'CAPRICORNIO I', planet: 'Júpiter', startDeg: 270, endDeg: 280, color: '#ec4899' },
  { id: 29, label: 'D29', sign: 'CAPRICORNIO II', planet: 'Marte', startDeg: 280, endDeg: 290, color: '#ec4899' },
  { id: 30, label: 'D30', sign: 'CAPRICORNIO III', planet: 'Sol', startDeg: 290, endDeg: 300, color: '#ec4899' },

  // ACUARIO (Casa XI: 300° - 330°)
  { id: 31, label: 'D31', sign: 'ACUARIO I', planet: 'Venus', startDeg: 300, endDeg: 310, color: '#f43f5e' },
  { id: 32, label: 'D32', sign: 'ACUARIO II', planet: 'Mercurio', startDeg: 310, endDeg: 320, color: '#f43f5e' },
  { id: 33, label: 'D33', sign: 'ACUARIO III', planet: 'Luna', startDeg: 320, endDeg: 330, color: '#f43f5e' },

  // PISCIS (Casa XII: 330° - 360°)
  { id: 34, label: 'D34', sign: 'PISCIS I', planet: 'Saturno', startDeg: 330, endDeg: 340, color: '#94a3b8' },
  { id: 35, label: 'D35', sign: 'PISCIS II', planet: 'Júpiter', startDeg: 340, endDeg: 350, color: '#94a3b8' },
  { id: 36, label: 'D36', sign: 'PISCIS III', planet: 'Marte', startDeg: 350, endDeg: 360, color: '#94a3b8' }
];
/**
 * Realistic sample diamond records and summaries for demonstration or initial testing
 */
export const SAMPLE_DATA = {
  records: [
    // October 2026 records (Matches prompt examples: 01 Oct 3.4 Deposited, 02 Oct 2.3 Not Deposited, 03 Oct 4.5 Deposited & 6 Not Deposited, etc.)
    {
      id: "pkt_sample_101",
      date: "2026-10-01",
      weight: 3.4,
      shape: "Round",
      hasUniqueId: true,
      hasPacketId: true,
      packetId: "PKT-1001",
      notes: "Flawless cut, exceptional brilliance",
      isDeposited: true,
      createdAt: "2026-10-01T09:15:00.000Z",
      updatedAt: "2026-10-01T09:15:00.000Z"
    },
    {
      id: "pkt_sample_102",
      date: "2026-10-02",
      weight: 2.3,
      shape: "Oval",
      hasUniqueId: false,
      hasPacketId: false,
      packetId: null,
      notes: "Custom oval symmetry",
      isDeposited: false,
      createdAt: "2026-10-02T10:30:00.000Z",
      updatedAt: "2026-10-02T10:30:00.000Z"
    },
    {
      id: "pkt_sample_103",
      date: "2026-10-03",
      weight: 4.5,
      shape: "Round",
      hasUniqueId: true,
      hasPacketId: true,
      packetId: "PKT003",
      notes: "Good quality, premium polish",
      isDeposited: true,
      createdAt: "2026-10-03T11:00:00.000Z",
      updatedAt: "2026-10-03T11:00:00.000Z"
    },
    {
      id: "pkt_sample_104",
      date: "2026-10-03",
      weight: 6.0,
      shape: "Princess",
      hasUniqueId: false,
      hasPacketId: false,
      packetId: null,
      notes: "Large crystal, clean facets",
      isDeposited: false,
      createdAt: "2026-10-03T14:45:00.000Z",
      updatedAt: "2026-10-03T14:45:00.000Z"
    },
    {
      id: "pkt_sample_105",
      date: "2026-10-04",
      weight: 2.5,
      shape: "Emerald",
      hasUniqueId: true,
      hasPacketId: true,
      packetId: "PKT-1005",
      notes: "Step cut, very high clarity",
      isDeposited: true,
      createdAt: "2026-10-04T10:20:00.000Z",
      updatedAt: "2026-10-04T10:20:00.000Z"
    },
    {
      id: "pkt_sample_106",
      date: "2026-10-04",
      weight: 3.2,
      shape: "Pear",
      hasUniqueId: true,
      hasPacketId: true,
      packetId: "PKT-1006",
      notes: "Tear drop shape, delicate tip",
      isDeposited: true,
      createdAt: "2026-10-04T12:00:00.000Z",
      updatedAt: "2026-10-04T12:00:00.000Z"
    },
    {
      id: "pkt_sample_107",
      date: "2026-10-04",
      weight: 5.1,
      shape: "Marquise",
      hasUniqueId: false,
      hasPacketId: false,
      packetId: null,
      notes: "Navette cut",
      isDeposited: false,
      createdAt: "2026-10-04T15:10:00.000Z",
      updatedAt: "2026-10-04T15:10:00.000Z"
    },
    {
      id: "pkt_sample_108",
      date: "2026-10-04",
      weight: 7.0,
      shape: "Cushion",
      hasUniqueId: true,
      hasPacketId: true,
      packetId: "PKT-1008",
      notes: "Antique cushion brilliant",
      isDeposited: true,
      createdAt: "2026-10-04T17:30:00.000Z",
      updatedAt: "2026-10-04T17:30:00.000Z"
    },
    {
      id: "pkt_sample_109",
      date: "2026-10-05",
      weight: 8.5,
      shape: "Radiant",
      hasUniqueId: true,
      hasPacketId: true,
      packetId: "PKT-1009",
      notes: "Exceptional fire and sparkle",
      isDeposited: true,
      createdAt: "2026-10-05T11:45:00.000Z",
      updatedAt: "2026-10-05T11:45:00.000Z"
    },
    {
      id: "pkt_sample_110",
      date: "2026-10-05",
      weight: 10.0,
      shape: "Round",
      hasUniqueId: true,
      hasPacketId: true,
      packetId: "PKT-1010",
      notes: "Special order for VIP customer",
      isDeposited: true,
      createdAt: "2026-10-05T16:00:00.000Z",
      updatedAt: "2026-10-05T16:00:00.000Z"
    },
    // September 2026 records
    {
      id: "pkt_sample_201",
      date: "2026-09-12",
      weight: 4.8,
      shape: "Round",
      hasUniqueId: true,
      hasPacketId: true,
      packetId: "PKT-0912",
      notes: "Excellent polish",
      isDeposited: true,
      createdAt: "2026-09-12T10:00:00.000Z",
      updatedAt: "2026-09-12T10:00:00.000Z"
    },
    {
      id: "pkt_sample_202",
      date: "2026-09-18",
      weight: 5.2,
      shape: "Princess",
      hasUniqueId: false,
      hasPacketId: false,
      packetId: null,
      notes: "Clean square cut",
      isDeposited: true,
      createdAt: "2026-09-18T14:00:00.000Z",
      updatedAt: "2026-09-18T14:00:00.000Z"
    },
    {
      id: "pkt_sample_203",
      date: "2026-09-25",
      weight: 6.4,
      shape: "Heart",
      hasUniqueId: true,
      hasPacketId: true,
      packetId: "PKT-0925",
      notes: "Symmetrical cleft",
      isDeposited: true,
      createdAt: "2026-09-25T11:30:00.000Z",
      updatedAt: "2026-09-25T11:30:00.000Z"
    }
  ],
  monthlySummaries: [
    {
      id: "2026-09",
      month: 9,
      year: 2026,
      totalDiamonds: 31,
      totalWeight: 134.0,
      depositedDiamonds: 31,
      depositedWeight: 134.0,
      pricePerCarat: 550,
      totalAmount: 73700,
      notes: "September monthly closure completed",
      savedAt: "2026-09-30T18:30:00.000Z"
    },
    {
      id: "2026-08",
      month: 8,
      year: 2026,
      totalDiamonds: 24,
      totalWeight: 110.0,
      depositedDiamonds: 24,
      depositedWeight: 110.0,
      pricePerCarat: 500,
      totalAmount: 55000,
      notes: "August summary finalized",
      savedAt: "2026-08-31T18:00:00.000Z"
    },
    {
      id: "2026-07",
      month: 7,
      year: 2026,
      totalDiamonds: 28,
      totalWeight: 125.0,
      depositedDiamonds: 28,
      depositedWeight: 125.0,
      pricePerCarat: 525,
      totalAmount: 65625,
      notes: "July monsoon season production",
      savedAt: "2026-07-31T19:00:00.000Z"
    }
  ]
};

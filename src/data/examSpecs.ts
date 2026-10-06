/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExamSpecification {
  portal: string;
  name: string;
  photoLimit: string;
  photoKbTarget: number;
  photoDimensions: string;
  photoWidth: number;
  photoHeight: number;
  signLimit: string;
  signKbTarget: number;
  signDimensions: string;
  signWidth: number;
  signHeight: number;
}

export const POPULAR_EXAM_SPECS: ExamSpecification[] = [
  {
    portal: 'SSC',
    name: 'SSC (CGL, CHSL, MTS, GD)',
    photoLimit: '20 KB - 50 KB',
    photoKbTarget: 50,
    photoDimensions: '200 × 230 px',
    photoWidth: 200,
    photoHeight: 230,
    signLimit: '10 KB - 20 KB',
    signKbTarget: 20,
    signDimensions: '140 × 60 px',
    signWidth: 140,
    signHeight: 60,
  },
  {
    portal: 'UPSC',
    name: 'UPSC (CSE, NDA, CDS, OTR)',
    photoLimit: '20 KB - 50 KB',
    photoKbTarget: 50,
    photoDimensions: '350 × 350 px',
    photoWidth: 350,
    photoHeight: 350,
    signLimit: '10 KB - 20 KB',
    signKbTarget: 20,
    signDimensions: '140 × 60 px',
    signWidth: 140,
    signHeight: 60,
  },
  {
    portal: 'NTA',
    name: 'NTA (NEET, JEE Main, CUET)',
    photoLimit: '10 KB - 200 KB',
    photoKbTarget: 100,
    photoDimensions: '350 × 450 px',
    photoWidth: 350,
    photoHeight: 450,
    signLimit: '10 KB - 50 KB',
    signKbTarget: 30,
    signDimensions: '140 × 60 px',
    signWidth: 140,
    signHeight: 60,
  },
  {
    portal: 'Banking',
    name: 'IBPS (PO, Clerk) & SBI',
    photoLimit: '20 KB - 50 KB',
    photoKbTarget: 50,
    photoDimensions: '200 × 230 px',
    photoWidth: 200,
    photoHeight: 230,
    signLimit: '10 KB - 20 KB',
    signKbTarget: 20,
    signDimensions: '140 × 60 px',
    signWidth: 140,
    signHeight: 60,
  },
  {
    portal: 'Passport',
    name: 'Passport Seva & Driving License',
    photoLimit: 'Under 100 KB',
    photoKbTarget: 100,
    photoDimensions: '350 × 450 px',
    photoWidth: 350,
    photoHeight: 450,
    signLimit: 'Under 50 KB',
    signKbTarget: 50,
    signDimensions: '200 × 100 px',
    signWidth: 200,
    signHeight: 100,
  },
  {
    portal: 'State PSC',
    name: 'State PSCs (UPPSC, BPSC, MPSC, etc.)',
    photoLimit: '20 KB - 50 KB',
    photoKbTarget: 50,
    photoDimensions: '150 × 200 px',
    photoWidth: 150,
    photoHeight: 200,
    signLimit: '10 KB - 20 KB',
    signKbTarget: 20,
    signDimensions: '140 × 60 px',
    signWidth: 140,
    signHeight: 60,
  },
];

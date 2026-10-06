/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SeoLandingPageData {
  slug: string;
  path: string;
  h1: string;
  title: string;
  description: string;
  lead: string;
  toolType:
    | 'compressor-20'
    | 'compressor-50'
    | 'compressor-100'
    | 'compressor-200'
    | 'resize-photo'
    | 'resize-signature'
    | 'compress-pdf'
    | 'compress-pdf-200';
  targetKB?: number;
  howToUseSteps: Array<{
    num: string;
    title: string;
    desc: string;
  }>;
  faqs: Array<{
    q: string;
    a: string;
  }>;
  relatedLinks: Array<{
    label: string;
    path: string;
    desc: string;
  }>;
}

export const SEO_LANDING_PAGES: Record<string, SeoLandingPageData> = {
  'compress-image-to-20kb': {
    slug: 'compress-image-to-20kb',
    path: '/compress-image-to-20kb',
    h1: 'Compress Image to 20KB Online',
    title: 'Compress Image to 20KB Online | Fix My File',
    description:
      'Compress photo and image files under 20KB online for free. Tailored for SSC CGL, CHSL, IBPS PO, clerk, and government portal uploads.',
    lead:
      'Reduce your JPG, JPEG, or PNG photo to 20 KB or less directly in your web browser. Built specifically for banking (IBPS, SBI), staff selection (SSC), and state police recruitment forms that enforce strict 10 KB to 20 KB file-size ceilings.',
    toolType: 'compressor-20',
    targetKB: 20,
    howToUseSteps: [
      {
        num: '1',
        title: 'Upload your photo',
        desc: 'Select or drag your JPG, JPEG, or PNG photo into the upload box below.',
      },
      {
        num: '2',
        title: '20 KB target selected',
        desc: 'The tool is preset to compress your photo strictly under the 20 KB limit.',
      },
      {
        num: '3',
        title: 'Click Compress Photo',
        desc: 'High-speed browser algorithms optimize image quality while respecting the 20 KB ceiling.',
      },
      {
        num: '4',
        title: 'Download ready JPG',
        desc: 'Save your compressed photo instantly and upload directly to your application portal.',
      },
    ],
    faqs: [
      {
        q: 'How do I compress an image to 20KB?',
        a: 'Upload your photo using the tool above with the 20 KB option selected. Click "Compress Photo", and Fix My File will automatically optimize the image using in-browser canvas calculations to stay strictly under 20 KB.',
      },
      {
        q: 'Will the image quality be reduced when compressing to 20KB?',
        a: 'Because 20 KB is a very strict limit, the file must be compressed significantly. However, Fix My File uses smart downsampling to keep facial features recognizable and suitable for exam verification systems.',
      },
      {
        q: 'Which image formats are supported?',
        a: 'You can upload JPG, JPEG, and PNG images. The final downloaded file is exported in standard JPG format, which is accepted by government and exam portals.',
      },
      {
        q: 'Can I use the compressed image for an online application?',
        a: 'Yes. The output is compliant with portals requiring file sizes under 20 KB, such as SSC and IBPS forms. Always double-check your official notification for additional dimension guidelines.',
      },
    ],
    relatedLinks: [
      {
        label: 'Compress Image to 50KB',
        path: '/compress-image-to-50kb',
        desc: 'Standard for UPSC, OTR, and State PSCs',
      },
      {
        label: 'Compress Image to 100KB',
        path: '/compress-image-to-100kb',
        desc: 'Standard for NEET, JEE Main & CUET',
      },
      {
        label: 'Resize Photo',
        path: '/resize-photo',
        desc: 'Change exact pixel width and height',
      },
      {
        label: 'Resize Signature',
        path: '/resize-signature',
        desc: 'Format signature to 140 × 60 px and 20 KB',
      },
    ],
  },

  'compress-image-to-50kb': {
    slug: 'compress-image-to-50kb',
    path: '/compress-image-to-50kb',
    h1: 'Compress Image to 50KB Online',
    title: 'Compress Image to 50KB Online | Fix My File',
    description:
      'Compress images to 50KB or less online in your browser. Perfect for UPSC Civil Services, OTR, NDA, CDS, and State PSC application forms.',
    lead:
      'Compress your photo to 50 KB or less in seconds without uploading files to a server. 50 KB is the single most common upper limit across Indian public service commissions including UPSC, UPPSC, BPSC, MPSC, and central recruitment portals.',
    toolType: 'compressor-50',
    targetKB: 50,
    howToUseSteps: [
      {
        num: '1',
        title: 'Upload your photo',
        desc: 'Select your photo from your phone gallery or computer.',
      },
      {
        num: '2',
        title: '50 KB limit configured',
        desc: 'Target is automatically configured to 50 KB for UPSC and State PSC compliance.',
      },
      {
        num: '3',
        title: 'Compress Photo',
        desc: 'Click the button to optimize image quality while staying safely under 50 KB.',
      },
      {
        num: '4',
        title: 'Download file',
        desc: 'Download your ready-to-upload JPEG file directly to your device.',
      },
    ],
    faqs: [
      {
        q: 'How do I compress an image to 50KB?',
        a: 'Upload your photo to the tool above, ensure 50 KB is selected, and click "Compress Photo". The tool will optimize the file size to 45–49 KB so portal automated validators accept it without errors.',
      },
      {
        q: 'Will the photo remain clear at 50KB?',
        a: 'Yes. 50 KB is ample for passport-size portraits. Fix My File preserves facial clarity, background contrast, and edge sharpness required for identity verification.',
      },
      {
        q: 'Why does my portal reject files slightly over 50KB?',
        a: 'Government servers reject files if they are even 50.1 KB. Fix My File strictly enforces the ceiling so the output file size is always under or equal to 50 KB.',
      },
      {
        q: 'Can I compress a photo taken on my mobile phone?',
        a: 'Yes. Phone camera photos are typically 2 MB to 8 MB. Fix My File easily reduces them under 50 KB right on your mobile phone browser.',
      },
    ],
    relatedLinks: [
      {
        label: 'Compress Image to 20KB',
        path: '/compress-image-to-20kb',
        desc: 'For banking & SSC application forms',
      },
      {
        label: 'Compress Image to 100KB',
        path: '/compress-image-to-100kb',
        desc: 'For NEET, JEE & college admissions',
      },
      {
        label: 'Resize Photo',
        path: '/resize-photo',
        desc: 'Set custom width and height in pixels',
      },
      {
        label: 'Resize Signature',
        path: '/resize-signature',
        desc: 'Prepare 140 × 60 px signature for UPSC/SSC',
      },
    ],
  },

  'compress-image-to-100kb': {
    slug: 'compress-image-to-100kb',
    path: '/compress-image-to-100kb',
    h1: 'Compress Image to 100KB Online',
    title: 'Compress Image to 100KB Online | Fix My File',
    description:
      'Reduce image file size to 100KB online without losing facial clarity. Standard requirement for NTA NEET, JEE Main, and college admissions.',
    lead:
      'Quickly compress your photo to 100 KB or less. 100 KB is the standard upper limit for national competitive entrance examinations conducted by the National Testing Agency (NTA), including NEET-UG, JEE Main, CUET, as well as university degree admissions.',
    toolType: 'compressor-100',
    targetKB: 100,
    howToUseSteps: [
      {
        num: '1',
        title: 'Upload your photo',
        desc: 'Choose your passport-style photograph from your computer or smartphone.',
      },
      {
        num: '2',
        title: '100 KB limit preset',
        desc: 'Configured for high clarity while remaining strictly within the 100 KB boundary.',
      },
      {
        num: '3',
        title: 'Compress Photo',
        desc: 'Click "Compress Photo" to process the image client-side in browser memory.',
      },
      {
        num: '4',
        title: 'Download file',
        desc: 'Save your compliant JPG photo and complete your registration.',
      },
    ],
    faqs: [
      {
        q: 'How do I compress an image to 100KB?',
        a: 'Select your photo in Step 1 below, verify the 100 KB button is selected, and click "Compress Photo". The resulting file will be ready in under a second.',
      },
      {
        q: 'Which exams require photo size under 100KB?',
        a: 'Major national entrance tests like NEET, JEE Main, CUET, GATE, and many central university admission portals require photos between 10 KB and 100 KB or 200 KB.',
      },
      {
        q: 'Are my photos uploaded to an external server?',
        a: 'No. All processing happens entirely inside your web browser on your own device. Your photos are never sent over the internet or saved to any cloud database.',
      },
      {
        q: 'Can I also resize the photo dimensions?',
        a: 'Yes. If your notification requires specific pixel dimensions (like 350 × 450 px), you can use our Photo Resizer tool after compressing.',
      },
    ],
    relatedLinks: [
      {
        label: 'Compress Image to 50KB',
        path: '/compress-image-to-50kb',
        desc: 'For UPSC, NDA, CDS and State PSCs',
      },
      {
        label: 'Compress Image to 200KB',
        path: '/compress-image-to-200kb',
        desc: 'For higher resolution portal limits',
      },
      {
        label: 'Resize Photo',
        path: '/resize-photo',
        desc: 'Set 350 × 450 px passport format',
      },
      {
        label: 'Compress PDF',
        path: '/compress-pdf',
        desc: 'Compress certificates and mark sheets',
      },
    ],
  },

  'compress-image-to-200kb': {
    slug: 'compress-image-to-200kb',
    path: '/compress-image-to-200kb',
    h1: 'Compress Image to 200KB Online',
    title: 'Compress Image to 200KB Online | Fix My File',
    description:
      'Compress high-resolution photos and documents under 200KB online. Fast, private client-side image compression for application portals.',
    lead:
      'Compress large photos and scanned image files under 200 KB. Ideal for university portal uploads, national scholarship applications, passport seva submissions, and state recruitment portals that accommodate higher resolution files up to 200 KB.',
    toolType: 'compressor-200',
    targetKB: 200,
    howToUseSteps: [
      {
        num: '1',
        title: 'Upload your image',
        desc: 'Drop your high-resolution photo or document scan into the tool.',
      },
      {
        num: '2',
        title: '200 KB size selected',
        desc: 'Preset to keep maximum visual detail while staying under 200 KB.',
      },
      {
        num: '3',
        title: 'Compress Image',
        desc: 'Click the button to optimize quality and reduce byte size.',
      },
      {
        num: '4',
        title: 'Download JPG',
        desc: 'Download your optimized image file ready for portal upload.',
      },
    ],
    faqs: [
      {
        q: 'How do I compress an image to 200KB?',
        a: 'Upload your image below, select the 200 KB option, and click "Compress Photo". The tool will optimize the image to remain under 200 KB.',
      },
      {
        q: 'Can I compress document scans to 200KB?',
        a: 'Yes. If you have an image scan of a certificate, mark sheet, or ID card, Fix My File will compress it cleanly under 200 KB.',
      },
      {
        q: 'Is there any file limit or cost?',
        a: 'Fix My File is 100% free with no account required, no file limits, and no subscriptions.',
      },
      {
        q: 'What if I need a PDF instead of an image?',
        a: 'If your application requires a PDF document under 200 KB, use our dedicated Compress PDF to 200KB tool.',
      },
    ],
    relatedLinks: [
      {
        label: 'Compress Image to 100KB',
        path: '/compress-image-to-100kb',
        desc: 'For stricter 100 KB portal limits',
      },
      {
        label: 'Compress Image to 50KB',
        path: '/compress-image-to-50kb',
        desc: 'For UPSC and state public service forms',
      },
      {
        label: 'Compress PDF to 200KB',
        path: '/compress-pdf-to-200kb',
        desc: 'For PDF document upload requirements',
      },
      {
        label: 'Resize Photo',
        path: '/resize-photo',
        desc: 'Adjust pixel width and height',
      },
    ],
  },

  'resize-photo': {
    slug: 'resize-photo',
    path: '/resize-photo',
    h1: 'Resize Photo Online',
    title: 'Resize Photo Online to Exact Pixels | Fix My File',
    description:
      'Resize photos to exact pixel width and height online. Includes presets for 350x450 passport, 200x230 SSC/UPSC, and custom dimensions.',
    lead:
      'Resize your photo to exact pixel width and height required by online examination portals. Easily match official specifications like 350 × 450 px (Passport/NEET), 200 × 230 px (SSC/IBPS), or 600 × 600 px (Visa) with free ratio or locked aspect ratio options.',
    toolType: 'resize-photo',
    howToUseSteps: [
      {
        num: '1',
        title: 'Upload photo',
        desc: 'Upload any JPG, JPEG, or PNG photograph from your device.',
      },
      {
        num: '2',
        title: 'Choose dimensions',
        desc: 'Pick an official preset or type your required width and height in pixels.',
      },
      {
        num: '3',
        title: 'Click Resize Photo',
        desc: 'The tool renders the image to exact pixel dimensions with smooth smoothing.',
      },
      {
        num: '4',
        title: 'Download resized photo',
        desc: 'Get your resized photo immediately and verify dimensions before uploading.',
      },
    ],
    faqs: [
      {
        q: 'How do I resize a photo to exact pixel dimensions?',
        a: 'Upload your photo to the Photo Resizer below, enter the target width and height in the pixel inputs (or choose a preset like 350 × 450 px), and click "Resize Photo".',
      },
      {
        q: 'What is the standard passport photo dimension in pixels?',
        a: 'For Indian passport applications and forms requiring 3.5 cm × 4.5 cm photos, 350 × 450 pixels (or 200 × 230 pixels for SSC/IBPS) is standard.',
      },
      {
        q: 'Can I lock the aspect ratio?',
        a: 'Yes. Click the "Ratio Locked" toggle if you want the height to adjust automatically when you change the width.',
      },
      {
        q: 'What if I also need to reduce the file size in KB?',
        a: 'After resizing, you can use our Photo Compressor to reduce the file to 20 KB, 50 KB, or 100 KB.',
      },
    ],
    relatedLinks: [
      {
        label: 'Compress Image to 50KB',
        path: '/compress-image-to-50kb',
        desc: 'Compress resized photo for UPSC forms',
      },
      {
        label: 'Compress Image to 100KB',
        path: '/compress-image-to-100kb',
        desc: 'Compress resized photo for NEET/JEE',
      },
      {
        label: 'Resize Signature',
        path: '/resize-signature',
        desc: 'Format signature to 140 × 60 px',
      },
      {
        label: 'Compress PDF',
        path: '/compress-pdf',
        desc: 'Compress certificates and documents',
      },
    ],
  },

  'resize-signature': {
    slug: 'resize-signature',
    path: '/resize-signature',
    h1: 'Resize Signature Online',
    title: 'Resize Signature Online | Fix My File',
    description:
      'Resize and compress your signature to 140x60 pixels and under 20KB online. Formats signatures with a clean white background for application forms.',
    lead:
      'Format and resize your signature to official exam dimensions like 140 × 60 px and compress under 20 KB. Fix My File automatically replaces transparent backgrounds with pure white paper, preventing the dreaded black box error when uploading to government portals.',
    toolType: 'resize-signature',
    targetKB: 20,
    howToUseSteps: [
      {
        num: '1',
        title: 'Upload signature photo',
        desc: 'Take a clear photo of your signature on white paper and upload it here.',
      },
      {
        num: '2',
        title: 'Select dimensions & size',
        desc: 'Default 140 × 60 px and 20 KB limit matches UPSC, SSC, and IBPS requirements.',
      },
      {
        num: '3',
        title: 'Process signature',
        desc: 'Click "Resize & Compress Signature" to clean paper shadows and format pixels.',
      },
      {
        num: '4',
        title: 'Download signature JPG',
        desc: 'Save your ready signature file with guaranteed white paper background.',
      },
    ],
    faqs: [
      {
        q: 'What is the required signature size for Indian exam portals?',
        a: 'Most portals (UPSC, SSC, IBPS, Railways) require signatures to be 140 × 60 pixels and between 10 KB and 20 KB in file size.',
      },
      {
        q: 'Why does my signature show a black background on application portals?',
        a: 'Transparent PNG files uploaded to forms that convert images to JPEG often turn black. Fix My File automatically puts your signature on a clean white background to avoid this.',
      },
      {
        q: 'Can I upload a smartphone photo of my signature?',
        a: 'Yes. Fix My File includes an optional shadow clearance filter that brightens grayish phone camera shadows to clean white paper.',
      },
      {
        q: 'Can I set custom signature dimensions?',
        a: 'Yes. While 140 × 60 px is standard, you can also select 200 × 50 px, 200 × 100 px, or enter custom pixel dimensions.',
      },
    ],
    relatedLinks: [
      {
        label: 'Compress Image to 20KB',
        path: '/compress-image-to-20kb',
        desc: 'Prepare 20 KB applicant photo',
      },
      {
        label: 'Compress Image to 50KB',
        path: '/compress-image-to-50kb',
        desc: 'Prepare 50 KB applicant photo',
      },
      {
        label: 'Resize Photo',
        path: '/resize-photo',
        desc: 'Match passport photo dimensions',
      },
      {
        label: 'Compress PDF',
        path: '/compress-pdf',
        desc: 'Optimize application documents',
      },
    ],
  },

  'compress-pdf': {
    slug: 'compress-pdf',
    path: '/compress-pdf',
    h1: 'Compress PDF Online',
    title: 'Compress PDF Online | Reduce PDF Size | Fix My File',
    description:
      'Compress PDF files online directly in your browser. Reduce document size for certificates, mark sheets, and KYC uploads without server uploads.',
    lead:
      'Compress PDF files directly inside your browser without uploading documents to remote cloud servers. Perfect for students and job applicants who need to reduce PDF certificates, educational mark sheets, identity proofs, and KYC forms to meet upload ceilings.',
    toolType: 'compress-pdf',
    howToUseSteps: [
      {
        num: '1',
        title: 'Upload PDF file',
        desc: 'Select or drag your PDF certificate or document into the upload area.',
      },
      {
        num: '2',
        title: 'Select target size',
        desc: 'Choose your portal ceiling, such as 100 KB, 200 KB, 500 KB, or 1 MB.',
      },
      {
        num: '3',
        title: 'Compress PDF',
        desc: 'Browser algorithms optimize internal streams and remove unneeded metadata.',
      },
      {
        num: '4',
        title: 'Download optimized PDF',
        desc: 'Download your compressed PDF file immediately, completely private.',
      },
    ],
    faqs: [
      {
        q: 'How do I compress a PDF online?',
        a: 'Upload your PDF in Step 1 below, choose your target size (e.g. 200 KB or 500 KB), and click "Compress PDF". Your document will be optimized client-side in seconds.',
      },
      {
        q: 'Will my PDF document remain readable?',
        a: 'Yes. Fix My File preserves page layout, text rendering, and vector content while removing stream redundancies and excessive metadata.',
      },
      {
        q: 'Are my confidential certificates uploaded to a server?',
        a: 'No. The entire PDF optimization executes client-side in your local browser memory using pdf-lib. No documents are sent over the internet or saved remotely.',
      },
      {
        q: 'What happens if a PDF contains high-resolution photo scans?',
        a: 'The tool compresses internal data streams to reduce file size. For very large scanned PDFs, saving pages at modest DPI before conversion produces the best result.',
      },
    ],
    relatedLinks: [
      {
        label: 'Compress PDF to 200KB',
        path: '/compress-pdf-to-200kb',
        desc: 'Strict 200 KB certificate limit',
      },
      {
        label: 'Compress Image to 100KB',
        path: '/compress-image-to-100kb',
        desc: 'For photo file requirements',
      },
      {
        label: 'Resize Photo',
        path: '/resize-photo',
        desc: 'Adjust pixel dimensions for photos',
      },
      {
        label: 'Resize Signature',
        path: '/resize-signature',
        desc: 'Prepare signature for form submission',
      },
    ],
  },

  'compress-pdf-to-200kb': {
    slug: 'compress-pdf-to-200kb',
    path: '/compress-pdf-to-200kb',
    h1: 'Compress PDF to 200KB Online',
    title: 'Compress PDF to 200KB Online | Fix My File',
    description:
      'Compress PDF documents under 200KB online for free. Ideal for government exam certificate uploads and KYC documentation.',
    lead:
      'Compress your PDF document to 200 KB or less directly in your browser. 200 KB is the common maximum limit enforced by government recruitment portals, state public service commissions, and universities for uploading educational certificates, caste certificates, and mark sheets.',
    toolType: 'compress-pdf-200',
    targetKB: 200,
    howToUseSteps: [
      {
        num: '1',
        title: 'Upload your PDF',
        desc: 'Select your scanned certificate or application document.',
      },
      {
        num: '2',
        title: '200 KB target preset',
        desc: 'Pre-configured for the 200 KB document upload ceiling.',
      },
      {
        num: '3',
        title: 'Compress PDF',
        desc: 'Click "Compress PDF" to optimize internal streams locally.',
      },
      {
        num: '4',
        title: 'Download file',
        desc: 'Save your compressed PDF document and verify its file size.',
      },
    ],
    faqs: [
      {
        q: 'How do I compress a PDF to 200KB?',
        a: 'Upload your PDF in the tool below with the 200 KB option selected, and click "Compress PDF". The tool will optimize data structures to fit under the limit.',
      },
      {
        q: 'Will the PDF text and stamps remain legible?',
        a: 'Yes. Fix My File maintains font rendering and document content integrity so official stamps, roll numbers, and grades remain clearly readable.',
      },
      {
        q: 'What if the PDF cannot reach 200KB?',
        a: 'If a PDF contains multiple full-color 600 DPI scans, reducing it below 200 KB without raster loss may be limited by the original document complexity. Fix My File applies maximum stream compression to get as close as technically possible.',
      },
      {
        q: 'Is this tool safe for confidential government documents?',
        a: 'Yes. Fix My File runs 100% in your browser. Your certificate never leaves your computer or phone.',
      },
    ],
    relatedLinks: [
      {
        label: 'Compress PDF (General)',
        path: '/compress-pdf',
        desc: 'Choose custom or 500 KB targets',
      },
      {
        label: 'Compress Image to 50KB',
        path: '/compress-image-to-50kb',
        desc: 'For applicant photo preparation',
      },
      {
        label: 'Compress Image to 100KB',
        path: '/compress-image-to-100kb',
        desc: 'For entrance test photo requirements',
      },
      {
        label: 'Resize Signature',
        path: '/resize-signature',
        desc: 'Format signature to 140 × 60 px',
      },
    ],
  },
};

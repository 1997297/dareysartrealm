import { Service } from '@/types/service';

export const MOCK_SERVICES: Service[] = [
  {
    id: 'srv-001',
    number: '01',
    slug: 'original-artwork',
    title: 'Artworks',
    shortDescription:
      'Explore original, ready-made artworks available for purchase. Each piece is individually created and available to own.',
    description:
      'Explore original, ready-made artworks available for acquisition. Each piece is individually created by Darey using heavy impasto palette-knife techniques, raw mineral pigments, oil glazes, and tactile textures on heavy Belgian linen. Works are fully archived, registered in the studio ledger, and accompanied by a sealed Certificate of Authenticity.',
    coverImage: {
      url: '/artworks/pic5.jpeg',
      alt: 'Original Artworks by Darey',
    },
    ctaLabel: 'Browse Artworks',
    ctaHref: '/artworks',
    pricingStructure: 'From $1,800 to $12,000+ USD depending on scale, medium, and framing',
    typicalTimeline: 'Immediate dispatch (3–7 business days conditioning & crating)',
    features: [
      'Original 1-of-1 archival fine art canvas',
      'Accompanied by signed physical Certificate of Authenticity',
      'Museum-grade timber crating & climate-controlled transport',
      'Fully documented provenance history in private collector ledger',
      'Professional installation consulting available upon request',
    ],
    process: [
      {
        step: '01',
        title: 'Exhibition Discovery',
        description: 'Explore curated rooms and filtered catalogues to find pieces that resonate with your space.',
      },
      {
        step: '02',
        title: 'Curatorial Consultation',
        description: 'Connect with the studio for virtual wall simulations, lighting considerations, and high-resolution details.',
      },
      {
        step: '03',
        title: 'Archival Conditioning',
        description: 'The piece undergoes final varnish inspection, wax sealing, and custom crating.',
      },
      {
        step: '04',
        title: 'Courier Handover',
        description: 'Fully insured white-glove transport directly to your residence or institution.',
      },
    ],
    faq: [
      {
        question: 'Are works shipped stretched or rolled?',
        answer: 'Original canvases are typically shipped stretched on custom hardwood bars in reinforced timber crates to preserve impasto texture. Monumental overseas pieces can be rolled in archival tubes upon request.',
      },
      {
        question: 'How do I verify provenance?',
        answer: 'Every piece includes a wax-sealed Certificate of Authenticity with a unique registration code permanently logged in the studio archive.',
      },
    ],
  },
  {
    id: 'srv-002',
    number: '02',
    slug: 'custom-commissions',
    title: 'Custom Artworks',
    shortDescription:
      'Bespoke, deeply personalized artworks developed in intimate dialogue with private collectors, institutions, and architects.',
    description:
      'A collaborative fine art journey where your story, architectural proportions, and emotional resonance are synthesized into a monumental original work. From preliminary charcoal studies to final textural sculpting, every milestone is shared through your private collector portal.',
    coverImage: {
      url: '/artworks/hero.jpeg',
      alt: 'Darey with monumental custom artwork in studio',
    },
    ctaLabel: 'Create a Piece',
    ctaHref: '/commission',
    pricingStructure: 'Quoted individually based on dimensions, substrates, and complexity (typically $2,500 – $15,000+ USD)',
    typicalTimeline: '6 to 12 weeks from deposit to completion',
    features: [
      'Direct creative dialogue and study sketch approvals with Darey',
      'Substrate priming and palette customization tailored to room light',
      'Weekly progress updates and work-in-progress photographic archive',
      'Private studio preview before final varnish and crating',
      'Wax-sealed bespoke provenance documentation',
    ],
    process: [
      {
        step: '01',
        title: 'Vision & Brief',
        description: 'Submit your room measurements, mood preferences, color swatches, and conceptual intentions.',
      },
      {
        step: '02',
        title: 'Study Sketches & Palette Alignment',
        description: 'Darey develops compositional sketches and pigment swatches for your approval.',
      },
      {
        step: '03',
        title: 'Tactile Creation',
        description: 'Impasto sculpting and glaze layering begin, with regular portal photo updates.',
      },
      {
        step: '04',
        title: 'Preview & Delivery',
        description: 'Collector approval of completed work, followed by custom timber crating and delivery.',
      },
    ],
    faq: [
      {
        question: 'What is the deposit structure for commissions?',
        answer: 'A 50% deposit confirms your reservation in the studio calendar; the remaining 50% is due upon collector approval of the completed piece before dispatch.',
      },
      {
        question: 'Can I request adjustments during creation?',
        answer: 'Yes. Revisions are invited during the sketch study phase, and minor tonal balancing can be accommodated during the mid-creation review.',
      },
    ],
  },
  {
    id: 'srv-003',
    number: '03',
    slug: 'murals',
    title: 'Architectural Murals',
    shortDescription:
      'Transformative large-scale site-specific murals for commercial headquarters, contemporary residences, and public cultural spaces.',
    description:
      'Site-specific monumental artworks executed directly on interior or exterior architectural surfaces. Darey works with architects, interior curators, and corporate patrons to activate soaring walls with arresting geometric stillness, organic movement, and tactile warmth.',
    coverImage: {
      url: '/artworks/architectural-murals.jpg',
      alt: 'Large-scale architectural geometric wall mural by Darey',
    },
    ctaLabel: 'Request Mural Consultation',
    pricingStructure: 'Per square meter / surface scope + travel and staging expenses (Custom proposal provided)',
    typicalTimeline: '2 to 6 weeks on-site execution following study approval',
    features: [
      'Scale mockups integrated directly onto architectural elevation drawings',
      'Durable, lightfast archival coatings resistant to atmospheric wear',
      'Custom color chemistry harmonized with interior architectural materials',
      'On-site execution with minimal disruption to client spaces',
      'Maintenance and conservation guidelines provided upon handover',
    ],
    process: [
      {
        step: '01',
        title: 'Site Analysis & Measurements',
        description: 'Review of wall dimensions, surface substrate, ambient natural lighting, and architectural CAD drawings.',
      },
      {
        step: '02',
        title: 'Concept Elevation Rendering',
        description: 'Digital study overlays and physical paint swatches placed in the actual space.',
      },
      {
        step: '03',
        title: 'Surface Priming & Scaffolding',
        description: 'Professional surface preparation to ensure maximum adhesion and long-term durability.',
      },
      {
        step: '04',
        title: 'Live Execution & Sealing',
        description: 'Hand-painted mural execution followed by protective matte or satin UV-resistant sealants.',
      },
    ],
    faq: [
      {
        question: 'Do you execute murals internationally?',
        answer: 'Yes. Studio travel, surface preparation equipment, and local scaffolding logistics are coordinated seamlessly for international projects.',
      },
      {
        question: 'How durable are interior and exterior murals?',
        answer: 'We utilize industrial-grade fine-art acrylics and UV-filtering sealants designed for longevity against sunlight, humidity, and public contact.',
      },
    ],
  },
  {
    id: 'srv-004',
    number: '04',
    slug: 'interior-finishes',
    title: 'Interior Art & Finishes',
    shortDescription:
      'Artisanal wall textures, bespoke tactile surfaces, and hand-applied metallic leaf for luxury interiors.',
    description:
      'Transcending traditional decorative wall coverings, Darey applies fine-art textural mastery to entire interior feature walls. Utilizing natural mineral plasters, pumice grounds, custom pigments, and hand-gilded metallic leaf, each wall becomes an immersive sensory sculpture.',
    coverImage: {
      url: '/artworks/interior-finishes.jpg',
      alt: 'Artisanal textured interior wall finish with tactile relief',
    },
    ctaLabel: 'Explore Finishes',
    pricingStructure: 'Project-based quotation depending on square meters and artisanal techniques',
    typicalTimeline: '1 to 3 weeks on-site installation',
    features: [
      'Fine-art impasto, lime-plaster, and mineral aggregate textures',
      'Hand-applied 24k gold, copper, and champagne silver leaf accents',
      'Custom tinted glazes calibrated to natural sun paths',
      'Seamless corner transitions and bespoke architectural integration',
      'Washable, protective non-yellowing wax and varnish topcoats',
    ],
    process: [
      {
        step: '01',
        title: 'Material Sampling',
        description: 'Production of physical 40 × 40 cm sample boards for architect and client review.',
      },
      {
        step: '02',
        title: 'Substrate Priming',
        description: 'Rigorous surface stabilization and base-layer leveling.',
      },
      {
        step: '03',
        title: 'Textural Sculpting & Gilding',
        description: 'Hand application of artisan plasters, metallic leafing, and palette knife relief.',
      },
      {
        step: '04',
        title: 'Protective Burnishing',
        description: 'Wax burnishing and sealing to provide tactile depth and durable protection.',
      },
    ],
    faq: [
      {
        question: 'Are sample boards available prior to committing?',
        answer: 'Yes. We prepare bespoke sample boards showcasing exact texture depth, gilding ratio, and lighting response.',
      },
      {
        question: 'Can these finishes be applied in bathrooms or high-traffic areas?',
        answer: 'Yes. We utilize specialized hydrophobic micro-cements and breathable protective sealants suitable for powder rooms and executive lounges.',
      },
    ],
  },
  {
    id: 'srv-005',
    number: '05',
    slug: 'house-painting-finishing',
    title: 'House Painting & Finishing',
    shortDescription:
      'Professional residential and commercial painting with an artistic eye. Premium finishes, colour consulting, and impeccable craftsmanship for complete spaces.',
    description:
      'Bringing an artist’s meticulous eye for nuance, tone, and light to full-scale residential and commercial painting projects. We provide flawless surface preparation, expert color consulting, and elite paint application that elevates living spaces into cohesive works of living art.',
    coverImage: {
      url: '/artworks/house-painting.jpg',
      alt: 'Professional house painting and wall finishing in vibrant modern tones',
    },
    ctaLabel: 'Get a Quote',
    pricingStructure: 'Competitive square-meter or full-project pricing following on-site or blueprint estimation',
    typicalTimeline: '3 to 14 days depending on home scale and scope',
    features: [
      'Comprehensive artistic color curation and light consulting',
      'Flawless surface preparation: skimming, crack repair, and priming',
      'Application of premium low-VOC and zero-VOC architectural coatings',
      'Precision masking, crisp trim lines, and spotless site protection',
      'Final walk-through inspection and touch-up warranty',
    ],
    process: [
      {
        step: '01',
        title: 'Consultation & Measure',
        description: 'On-site walkthrough or architectural blueprint review to evaluate square meters, lighting, and finishes.',
      },
      {
        step: '02',
        title: 'Color Palette Scheme',
        description: 'Curated selection of complementary hues that flatter your furnishings and natural light.',
      },
      {
        step: '03',
        title: 'Master Preparation',
        description: 'Complete floor masking, furniture protection, wall repairs, and adhesion priming.',
      },
      {
        step: '04',
        title: 'Artisan Application',
        description: 'Uniform two-coat roll and spray application followed by meticulous trim work and clean-up.',
      },
    ],
    faq: [
      {
        question: 'Do you provide paint color selection assistance?',
        answer: 'Yes. Color consultation is a cornerstone of our service; we test physical swatches in your room’s day and night lighting before full application.',
      },
      {
        question: 'What paint brands do you recommend and work with?',
        answer: 'We work with premium architectural coatings including Farrow & Ball, Dulux Heritage, Benjamin Moore, and regional commercial-grade equivalents.',
      },
    ],
  },
];

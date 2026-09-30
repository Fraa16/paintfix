import type { Locale } from '../routes';

export const carCopy = {
  de: {
    seo: {
      title: 'Autoaufbereitung Telgte & Münster, ab {minPrice} € | Paintfix',
      description:
        'Innen-, Außen- und Komplettaufbereitung, Lackkorrektur und Keramikversiegelung mit CarPro in Telgte bei Münster. Klare Pakete ab {minPrice} €, Termin in einem Werktag.',
    },
    hero: {
      kicker: 'Fahrzeugaufbereitung · Telgte',
      h1: ['Fahrzeugaufbereitung', 'in Telgte & Münster'],
      text: 'Innen, außen, Lack und Keramik. Ausschließlich mit CarPro-Produkten.',
      price: 'Pakete ab {minPrice} €',
    },
    statement: {
      title: ['Sorgfalt,', 'die man sieht.'],
      lead: 'Ob Familien-SUV nach dem Urlaub, Firmenwagen vor der Leasingrückgabe oder Ihr Wochenendauto:',
      text: 'Sie bekommen vorher einen klaren Preis und nachher ein Auto, das sich wieder wie neu anfühlt. Ohne Aufpreis für Dinge, die Sie nicht bestellt haben.',
    },
    areas: [
      {
        id: 'innenraum',
        word: 'Innenraum',
        lead: 'Sitze, Teppiche und jede Oberfläche, die Sie täglich anfassen. Tiefengereinigt, gepflegt und geruchsneutral.',
        cards: [
          {
            media: 'auto-int-1',
            title: 'Sitze & Polster',
            text: 'Sprühextraktion gegen Flecken, Krümel und Gerüche.',
          },
          {
            media: 'auto-int-2',
            title: 'Cockpit & Details',
            text: 'Kunststoffe, Lüftungsdüsen und Scheiben innen, bis in die Fugen.',
          },
        ],
      },
      {
        id: 'aussen',
        word: 'Außen & Lack',
        lead: 'Handwäsche, Dekontamination und Politur. Für Lack, der wieder Tiefe hat.',
        cards: [
          {
            media: 'auto-ext-1',
            title: 'Handwäsche & Dekontamination',
            text: 'Zwei-Eimer-Wäsche, Flugrost- und Teerentfernung.',
          },
          {
            media: 'auto-ext-2',
            title: 'Politur & Lackkorrektur',
            text: 'Maschinenpolitur gegen Swirls, Schleier und leichte Kratzer.',
          },
        ],
      },
      {
        id: 'keramik',
        word: 'Keramik',
        lead: 'Eine harte, glatte Schutzschicht, an der Schmutz schlecht haftet. Mit CQuartz von CarPro.',
        cards: [
          {
            media: 'auto-cer-1',
            title: 'CQuartz-Versiegelung',
            text: 'Wasser perlt ab, die Wäsche geht schneller.',
          },
          {
            media: 'auto-cer-2',
            title: 'Glanz, der bleibt',
            text: 'Schutz für Lack, Felgen und Glas über viele Monate.',
          },
        ],
      },
    ],
    packages: {
      kicker: 'Pakete & Preise',
      title: ['Vier Pakete.', 'Offene Preise.'],
      lead: 'Die Preise gelten ab Kleinwagen. Kompakt- und Mittelklasse, SUV und Van kosten etwas mehr, abhängig von Größe und Zustand.',
      classNote: 'Den finalen Preis nennen wir nach einer kurzen Begutachtung, bevor wir anfangen.',
      includes: 'Enthalten',
      choose: 'Paket anfragen',
    },
    addons: {
      kicker: 'Extras',
      title: ['Einzeln dazubuchbar'],
    },
    bridge: {
      title: ['Die Sorgfalt aus dem Hangar.', 'Die Preise für Ihr Auto.'],
      text: 'Wir bereiten auch Flugzeuge auf. Das merken Sie an der Genauigkeit, nicht an der Rechnung.',
      cta: 'Mehr über Paintfix Aviation',
    },
    products: {
      kicker: 'Produkte',
      title: ['Ausschließlich', 'CarPro.'],
      lead: 'Im Automobilbereich arbeiten wir nur mit Produkten von CarPro: Reiniger, Polituren und Keramikversiegelungen aus einem aufeinander abgestimmten System.',
      plates: [
        {
          label: 'Wäsche & Dekontamination',
          name: 'CarPro Reinigungssystem',
          text: 'pH-neutrale Shampoos und Dekontaminationsmittel, schonend für Versiegelungen.',
        },
        {
          label: 'Politur',
          name: 'CarPro Polituren',
          text: 'Abgestimmte Polituren und Pads für Lackkorrektur in einer oder mehreren Stufen.',
        },
        {
          label: 'Keramikschutz',
          name: 'CQuartz',
          text: 'Keramikversiegelung auf SiO₂-Basis für Lack, Felgen und Glas.',
        },
      ],
    },
    process: {
      kicker: 'Ablauf',
      title: ['So läuft', 'Ihr Termin.'],
      steps: [
        {
          title: 'Anfrage',
          text: 'Sie schicken Fahrzeug, Paket und Wunschtermin per Formular, E-Mail oder Telefon.',
        },
        {
          title: 'Begutachtung',
          text: 'Wir sehen uns den Zustand an und nennen den finalen Preis, bevor wir anfangen.',
        },
        {
          title: 'Aufbereitung',
          text: 'Je nach Paket einige Stunden bis zwei Tage. Sie müssen sich um nichts kümmern.',
        },
        {
          title: 'Übergabe',
          text: 'Sie bekommen Ihr Auto mit Pflegehinweisen für die nächsten Wochen zurück.',
        },
      ],
    },
    faq: { kicker: 'FAQ', title: ['Fragen zur', 'Autoaufbereitung'] },
    form: {
      kicker: 'Termin anfragen',
      title: ['Welches Auto,', 'welches Paket?'],
      text: 'Drei Angaben reichen. Wir melden uns innerhalb eines Werktags mit Terminvorschlag und Preis.',
    },
  },
  en: {
    seo: {
      title: 'Car Detailing in Telgte & Münster from €{minPrice} | Paintfix',
      description:
        'Interior, exterior and full detailing, paint correction and ceramic coating with CarPro in Telgte near Münster, Germany. Clear packages from €{minPrice}.',
    },
    hero: {
      kicker: 'Car detailing · Telgte',
      h1: ['Car detailing', 'in Telgte & Münster'],
      text: 'Interior, exterior, paint and ceramic. Exclusively with CarPro products.',
      price: 'Packages from €{minPrice}',
    },
    statement: {
      title: ['Care', 'you can see.'],
      lead: 'Whether it is the family SUV after the holidays, a company car before its lease return or your weekend car:',
      text: 'you get a clear price up front and a car that feels new again afterwards. No surcharges for things you did not order.',
    },
    areas: [
      {
        id: 'interior',
        word: 'Interior',
        lead: 'Seats, carpets and every surface you touch daily. Deep-cleaned, cared for and odour-free.',
        cards: [
          {
            media: 'auto-int-1',
            title: 'Seats & upholstery',
            text: 'Extraction cleaning against stains, crumbs and odours.',
          },
          {
            media: 'auto-int-2',
            title: 'Dashboard & details',
            text: 'Plastics, vents and interior glass, right into the gaps.',
          },
        ],
      },
      {
        id: 'exterior',
        word: 'Exterior & paint',
        lead: 'Hand wash, decontamination and polishing. For paint with depth again.',
        cards: [
          {
            media: 'auto-ext-1',
            title: 'Hand wash & decon',
            text: 'Two-bucket wash, iron fallout and tar removal.',
          },
          {
            media: 'auto-ext-2',
            title: 'Polish & correction',
            text: 'Machine polishing against swirls, haze and light scratches.',
          },
        ],
      },
      {
        id: 'ceramic',
        word: 'Ceramic',
        lead: 'A hard, slick protective layer that dirt struggles to stick to. With CQuartz by CarPro.',
        cards: [
          {
            media: 'auto-cer-1',
            title: 'CQuartz coating',
            text: 'Water beads off and washing gets quicker.',
          },
          {
            media: 'auto-cer-2',
            title: 'Gloss that lasts',
            text: 'Protection for paint, wheels and glass for many months.',
          },
        ],
      },
    ],
    packages: {
      kicker: 'Packages & prices',
      title: ['Four packages.', 'Published prices.'],
      lead: 'Prices start with small cars. Compact and mid-size cars, SUVs and vans cost a little more, depending on size and condition.',
      classNote: 'We confirm the final price after a short inspection, before we begin.',
      includes: 'Included',
      choose: 'Request this package',
    },
    addons: {
      kicker: 'Extras',
      title: ['Add to any package'],
    },
    bridge: {
      title: ['The care of the hangar.', 'The prices of a car.'],
      text: 'We also detail aircraft. You will notice it in the precision, not on the invoice.',
      cta: 'More about Paintfix Aviation',
    },
    products: {
      kicker: 'Products',
      title: ['Exclusively', 'CarPro.'],
      lead: 'For cars we work only with CarPro products: cleaners, polishes and ceramic coatings from one system designed to work together.',
      plates: [
        {
          label: 'Wash & decon',
          name: 'CarPro cleaning system',
          text: 'pH-neutral shampoos and decontamination products that are safe on coatings.',
        },
        {
          label: 'Polish',
          name: 'CarPro polishes',
          text: 'Matched polishes and pads for single- or multi-stage correction.',
        },
        {
          label: 'Ceramic protection',
          name: 'CQuartz',
          text: 'SiO₂-based ceramic coating for paint, wheels and glass.',
        },
      ],
    },
    process: {
      kicker: 'Process',
      title: ['How your', 'appointment works.'],
      steps: [
        {
          title: 'Request',
          text: 'Send us your vehicle, package and preferred date via the form, email or phone.',
        },
        {
          title: 'Inspection',
          text: 'We check the condition and confirm the final price before we begin.',
        },
        {
          title: 'Detailing',
          text: 'A few hours to two days depending on the package. You do not need to do anything.',
        },
        {
          title: 'Handover',
          text: 'You get your car back with aftercare tips for the weeks ahead.',
        },
      ],
    },
    faq: { kicker: 'FAQ', title: ['Questions about', 'car detailing'] },
    form: {
      kicker: 'Book an appointment',
      title: ['Which car,', 'which package?'],
      text: 'Three details are enough. We reply within one working day with a proposed date and price.',
    },
  },
} satisfies Record<Locale, unknown>;

import { AV as B } from './paintfix-data.js';
const X = {
  de: { rampCaption: 'Vorfeld EDDG, 05:40 Uhr', expLabel: 'Vor dem ersten Slot des Tages', expT1: 'Fertig, bevor', expT2: 'die Crew kommt.', hsHint: 'Weiter scrollen', chartLabel: 'Einsatzradius ab EDDG', chartSeat: 'Firmensitz', footAddrLabel: 'Anschrift', footAddr: ['Paintfix Aviation', 'Marshallstraße 34', '48291 Telgte'] },
  en: { rampCaption: 'Apron EDDG, 05:40 local', expLabel: 'Before the first slot of the day', expT1: 'Done before', expT2: 'the crew arrives.', hsHint: 'Keep scrolling', chartLabel: 'Coverage from EDDG', chartSeat: 'Head office', footAddrLabel: 'Address', footAddr: ['Paintfix Aviation', 'Marshallstraße 34', '48291 Telgte'] }
};
export const AV = { de: { ...B.de, ...X.de }, en: { ...B.en, ...X.en } };

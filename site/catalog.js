/* Setu service catalog.
   Each entry is (a) an option in the "What do you need?" picker and
   (b) the grounding context sent to the AI planner.
   `label` and `portal` are shown to the user, so they stay plain.
   `notes` is only sent to the model — it can be more detailed. Notes are
   deliberately general (how a service usually works, not an exact current
   process); the planner is told to say "check the official website" for
   anything specific. */
const CATALOG = [
  {
    id: 'income-certificate',
    label: 'Income, residence or caste certificate',
    category: 'Certificates & records',
    portal: 'Your state’s eDistrict website (or UMANG)',
    purposes: ['School or college admission', 'Scholarship', 'Government scheme', 'Job or ID proof', 'Other'],
    notes: 'Issued by the state Revenue department, usually after local verification by a Village or Revenue Officer. Applicants normally need identity proof, address proof, ration card, an existing income proof or a self-declaration, and a photo. A local enquiry step can add time. Income certificates are valid for a limited period and are re-applied for when they expire.'
  },
  {
    id: 'birth-certificate',
    label: 'Birth certificate (new, correction or extra copy)',
    category: 'Certificates & records',
    portal: 'Birth & death registration website, or your local municipal or panchayat office',
    purposes: ['School admission', 'Passport or ID', 'Correcting a name or date', 'Getting a lost copy again', 'Other'],
    notes: 'Handled by the local municipal body or gram panchayat under the Registration of Births and Deaths Act. Recent births are straightforward. Older records, or corrections to a name or date, usually need supporting proof such as a hospital record, school record or an affidavit, and an official has to approve the change.'
  },
  {
    id: 'death-certificate',
    label: 'Death certificate',
    category: 'Certificates & records',
    portal: 'Birth & death registration website, or your local municipal or panchayat office',
    purposes: ['Pension or insurance claim', 'Property or bank transfer', 'Government records', 'Other'],
    notes: 'Registered with the local municipal or panchayat authority. Needs proof of death such as a hospital or cremation record, identity of the person who died, and identity of the applicant. Registration long after the standard window can need a late-registration order from a designated officer.'
  },
  {
    id: 'marriage-registration',
    label: 'Marriage registration certificate',
    category: 'Certificates & records',
    portal: 'Your state’s marriage registration website, or the Sub-Registrar office',
    purposes: ['Visa or passport', 'Bank or insurance nominee', 'Name change', 'Legal proof', 'Other'],
    notes: 'Registered with the state under the Hindu Marriage Act or the Special Marriage Act. Typically needs identity and address proof for both partners, proof of marriage or witnesses, photographs, and often an appointment at the Sub-Registrar office. The Special Marriage Act route has a notice period before registration.'
  },
  {
    id: 'epf-withdrawal',
    label: 'PF withdrawal or advance',
    category: 'Provident fund & pension',
    portal: 'EPFO website or UMANG',
    purposes: ['Final settlement after leaving a job', 'Medical advance', 'Housing advance', 'Education or marriage advance', 'Other'],
    notes: 'Filed online against a Universal Account Number (UAN). Needs an activated UAN with Aadhaar, PAN and a bank account seeded and verified against it, and a correct date of exit for a final settlement. If KYC is fully verified employer attestation is not required. Claims are commonly rejected for a name or KYC mismatch between records.'
  },
  {
    id: 'epf-transfer',
    label: 'PF transfer after changing jobs',
    category: 'Provident fund & pension',
    portal: 'EPFO website',
    purposes: ['Move an old PF account into the current one', 'Combine two or more UANs', 'Other'],
    notes: 'Done through the member portal once the new employer has filed the first monthly contribution. Needs the old and the current PF account numbers, verified KYC on the UAN, and an online approval by one of the employers. Mismatched member name or date of birth across the two accounts is the usual blocker.'
  },
  {
    id: 'jeevan-pramaan',
    label: 'Pensioner life certificate (Jeevan Pramaan)',
    category: 'Provident fund & pension',
    portal: 'Jeevan Pramaan app or UMANG, or your pension bank',
    purposes: ['Yearly life certificate', 'Catching up after a missed year', 'Other'],
    notes: 'A digital life certificate that pensioners submit once a year, usually within a set window. Needs the Pension Payment Order (PPO) number, Aadhaar, the pension bank account, and a fingerprint or face-authentication step. It can be done at home on a phone, at a bank branch, at a post office, or at a Common Service Centre.'
  },
  {
    id: 'eps-pension',
    label: 'Pension claim (EPS)',
    category: 'Provident fund & pension',
    portal: 'EPFO website, or your regional EPFO office',
    purposes: ['Pension on retirement', 'Widow or child pension', 'Disability pension', 'Other'],
    notes: 'Claimed against Employees Pension Scheme membership, generally after a minimum service period and on reaching the eligible age. Needs verified KYC, bank details, and a scheme certificate where service was split across employers or regions. A family pension claim also needs the member death certificate and proof of the dependant relationship.'
  },
  {
    id: 'pan-card',
    label: 'PAN card (new or correction)',
    category: 'Tax',
    portal: 'NSDL or UTIITSL PAN website',
    purposes: ['First PAN', 'Correcting name, date of birth or photo', 'Getting a lost card again', 'Linking with Aadhaar', 'Other'],
    notes: 'Issued by the Income Tax Department through authorised agencies. Needs identity proof, date-of-birth proof, address proof and a photograph. Aadhaar-based e-KYC can make it fully online with no physical documents. A correction request needs proof of the correct detail. PAN is required to be linked with Aadhaar.'
  },
  {
    id: 'itr-filing',
    label: 'Income tax return filing (with help)',
    category: 'Tax',
    portal: 'Income Tax e-filing website',
    purposes: ['Salary income return', 'Refund claim', 'Return for a loan or visa', 'Replying to a notice', 'Other'],
    notes: 'Filed on the e-filing portal, usually before the yearly due date. Needs PAN linked with Aadhaar, a pre-validated bank account for any refund, Form 16 or salary details, interest certificates, and Form 26AS and the Annual Information Statement to cross-check income. The return must be e-verified within the allowed window or it is treated as not filed.'
  },
  {
    id: 'tax-refund',
    label: 'Income tax refund not received',
    category: 'Tax',
    portal: 'Income Tax e-filing website',
    purposes: ['Refund not received', 'Refund failed to the bank', 'Refund on hold', 'Other'],
    notes: 'Refunds are paid only into a bank account that is pre-validated and linked to the PAN. The common reasons a refund fails are an unvalidated, closed or joint account, a name mismatch, or a return that was never e-verified. A refund reissue request can be raised on the portal once the account is fixed.'
  },
  {
    id: 'dl-renewal',
    label: 'Driving licence renewal',
    category: 'Transport',
    portal: 'Parivahan (Sarathi) website',
    purposes: ['Licence expired or expiring', 'Renewal with an address change', 'Adding a vehicle type', 'Other'],
    notes: 'Handled on Parivahan Sarathi for the relevant RTO. Needs the existing licence, address and age proof, a medical certificate in the prescribed form above a certain age, a photo and signature, and a fee. Renewal a long time after expiry can require a fresh driving test rather than a simple renewal.'
  },
  {
    id: 'rc-transfer',
    label: 'Vehicle ownership transfer (RC)',
    category: 'Transport',
    portal: 'Parivahan (Vahan) website',
    purposes: ['Bought a used vehicle', 'Sold a vehicle', 'Transfer after a death in the family', 'Other'],
    notes: 'Done on Parivahan Vahan for the RTO where the vehicle is registered. Needs the registration certificate, valid insurance, a pollution-under-control certificate, identity and address proof for buyer and seller, and the prescribed transfer forms. An inheritance transfer also needs a death certificate and proof of succession.'
  },
  {
    id: 'nsp-scholarship',
    label: 'Scholarship application (NSP)',
    category: 'Welfare & education',
    portal: 'National Scholarship Portal (NSP)',
    purposes: ['Pre-matric scholarship', 'Post-matric scholarship', 'Merit or means scholarship', 'Renewing an existing scholarship', 'Other'],
    notes: 'A single portal for many central and state scholarship schemes, open only in a yearly window. Needs Aadhaar or an enrolment ID, a bank account in the student name seeded with Aadhaar, income and caste certificates where the scheme requires them, the previous year marksheet, and a fee receipt. After the student applies, the institute has to verify the application before the deadline.'
  },
  {
    id: 'ration-card',
    label: 'Ration card (new card or member change)',
    category: 'Welfare & education',
    portal: 'Your state’s ration card (food & civil supplies) website',
    purposes: ['New family card', 'Adding a newborn or spouse', 'Removing a member', 'Address change', 'Other'],
    notes: 'Issued by the state food and civil supplies department. Needs identity and address proof for the family, a photo of the head of the household, and proof of the specific change such as a birth or marriage certificate. Adding a member usually needs proof that the person was removed from any previous card. Field verification is common.'
  },
  {
    id: 'cpgrams-grievance',
    label: 'Complaint about a government service',
    category: 'Complaints',
    portal: 'CPGRAMS (pgportal.gov.in)',
    purposes: ['Delay in a service or benefit', 'No reply from an office', 'Application wrongly rejected', 'Staff behaviour', 'Other'],
    notes: 'A central portal to lodge a grievance against a central or state government office. It works best with a specific department, a clear one-paragraph description, dates, any earlier application or reference number, and supporting documents. There is an appeal option if the reply is unsatisfactory. It is meant for administrative grievances, not matters that are before a court.'
  }
];

if (typeof module !== 'undefined') module.exports = { CATALOG };

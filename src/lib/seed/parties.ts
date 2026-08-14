import type {
  Sender,
  Beneficiary,
  PayoutPartner,
  FloatAccount,
  Currency,
} from "@/lib/types";
import { corridors } from "@/lib/seed/reference";
import { seededRand } from "@/lib/utils";

export const senders: Sender[] = [
  { id: "SND-4821", firstName: "Adeola", lastName: "Bankole", email: "adeola.bankole@gmail.com", phone: "+44 7700 900482", country: "GB", countryName: "United Kingdom", regionId: "reg-weu", kycTier: "Tier 3", kycStatus: "Verified", monthlyLimit: 50000, currency: "GBP", riskScore: 12, status: "Active", beneficiaryIds: ["BEN-2001", "BEN-2002"], totalSent: 148230, transferCount: 64, joinedOn: "2024-03-12" },
  { id: "SND-4822", firstName: "Miguel", lastName: "Hernández", email: "miguel.h@outlook.com", phone: "+1 415 555 0192", country: "US", countryName: "United States", regionId: "reg-namer", kycTier: "Tier 2", kycStatus: "Verified", monthlyLimit: 25000, currency: "USD", riskScore: 22, status: "Active", beneficiaryIds: ["BEN-2003"], totalSent: 62400, transferCount: 41, joinedOn: "2024-07-02" },
  { id: "SND-4823", firstName: "Priya", lastName: "Nair", email: "priya.nair@gmail.com", phone: "+44 7700 900783", country: "GB", countryName: "United Kingdom", regionId: "reg-weu", kycTier: "Tier 3", kycStatus: "Verified", monthlyLimit: 50000, currency: "GBP", riskScore: 8, status: "Active", beneficiaryIds: ["BEN-2004", "BEN-2005"], totalSent: 211900, transferCount: 88, joinedOn: "2023-11-20" },
  { id: "SND-4824", firstName: "Thomas", lastName: "Müller", email: "t.mueller@web.de", phone: "+49 151 2345 678", country: "DE", countryName: "Germany", regionId: "reg-weu", kycTier: "Tier 2", kycStatus: "Verified", monthlyLimit: 25000, currency: "EUR", riskScore: 15, status: "Active", beneficiaryIds: ["BEN-2006"], totalSent: 38750, transferCount: 27, joinedOn: "2025-01-15" },
  { id: "SND-4825", firstName: "Fatima", lastName: "El Amrani", email: "fatima.amrani@gmail.com", phone: "+31 6 1234 5678", country: "NL", countryName: "Netherlands", regionId: "reg-weu", kycTier: "Tier 3", kycStatus: "Verified", monthlyLimit: 40000, currency: "EUR", riskScore: 19, status: "Active", beneficiaryIds: ["BEN-2007", "BEN-2008"], totalSent: 94120, transferCount: 53, joinedOn: "2024-05-30" },
  { id: "SND-4826", firstName: "James", lastName: "Okoro", email: "james.okoro@gmail.com", phone: "+44 7700 900611", country: "GB", countryName: "United Kingdom", regionId: "reg-weu", kycTier: "Tier 1", kycStatus: "Pending", monthlyLimit: 3000, currency: "GBP", riskScore: 44, status: "Flagged", beneficiaryIds: ["BEN-2009"], totalSent: 8400, transferCount: 12, joinedOn: "2026-06-18" },
  { id: "SND-4827", firstName: "Sofia", lastName: "Reyes", email: "sofia.reyes@yahoo.com", phone: "+1 213 555 0148", country: "US", countryName: "United States", regionId: "reg-namer", kycTier: "Tier 3", kycStatus: "Verified", monthlyLimit: 60000, currency: "USD", riskScore: 11, status: "Active", beneficiaryIds: ["BEN-2010", "BEN-2011"], totalSent: 176500, transferCount: 72, joinedOn: "2023-09-08" },
  { id: "SND-4828", firstName: "Amélie", lastName: "Bernard", email: "amelie.bernard@gmail.com", phone: "+33 6 12 34 56 78", country: "FR", countryName: "France", regionId: "reg-weu", kycTier: "Tier 2", kycStatus: "Verified", monthlyLimit: 25000, currency: "EUR", riskScore: 17, status: "Active", beneficiaryIds: ["BEN-2012"], totalSent: 45300, transferCount: 33, joinedOn: "2024-12-01" },
  { id: "SND-4829", firstName: "Rajesh", lastName: "Patel", email: "rajesh.patel@gmail.com", phone: "+1 408 555 0176", country: "US", countryName: "United States", regionId: "reg-namer", kycTier: "Tier 3", kycStatus: "Verified", monthlyLimit: 75000, currency: "USD", riskScore: 9, status: "Active", beneficiaryIds: ["BEN-2013", "BEN-2014"], totalSent: 289400, transferCount: 104, joinedOn: "2023-06-22" },
  { id: "SND-4830", firstName: "Chidi", lastName: "Nwankwo", email: "chidi.nwankwo@gmail.com", phone: "+44 7700 900934", country: "GB", countryName: "United Kingdom", regionId: "reg-weu", kycTier: "Tier 2", kycStatus: "Verified", monthlyLimit: 25000, currency: "GBP", riskScore: 28, status: "Active", beneficiaryIds: ["BEN-2015"], totalSent: 51200, transferCount: 38, joinedOn: "2024-08-14" },
  { id: "SND-4831", firstName: "Elena", lastName: "Popescu", email: "elena.popescu@gmail.com", phone: "+49 151 9876 543", country: "DE", countryName: "Germany", regionId: "reg-weu", kycTier: "Tier 1", kycStatus: "Rejected", monthlyLimit: 3000, currency: "EUR", riskScore: 67, status: "Blocked", beneficiaryIds: ["BEN-2016"], totalSent: 2100, transferCount: 4, joinedOn: "2026-07-29" },
  { id: "SND-4832", firstName: "Grace", lastName: "Mensah", email: "grace.mensah@gmail.com", phone: "+1 917 555 0133", country: "US", countryName: "United States", regionId: "reg-namer", kycTier: "Tier 2", kycStatus: "Verified", monthlyLimit: 25000, currency: "USD", riskScore: 21, status: "Active", beneficiaryIds: ["BEN-2017"], totalSent: 41800, transferCount: 29, joinedOn: "2025-02-11" },
  { id: "SND-4833", firstName: "Hassan", lastName: "Benali", email: "hassan.benali@gmail.com", phone: "+33 6 98 76 54 32", country: "FR", countryName: "France", regionId: "reg-weu", kycTier: "Tier 3", kycStatus: "Verified", monthlyLimit: 40000, currency: "EUR", riskScore: 14, status: "Active", beneficiaryIds: ["BEN-2018", "BEN-2019"], totalSent: 118600, transferCount: 61, joinedOn: "2024-02-19" },
  { id: "SND-4834", firstName: "Ana", lastName: "Cruz", email: "ana.cruz@gmail.com", phone: "+1 305 555 0187", country: "US", countryName: "United States", regionId: "reg-namer", kycTier: "Tier 3", kycStatus: "Verified", monthlyLimit: 60000, currency: "USD", riskScore: 13, status: "Active", beneficiaryIds: ["BEN-2020", "BEN-2021"], totalSent: 203100, transferCount: 91, joinedOn: "2023-10-05" },
  { id: "SND-4835", firstName: "Kwame", lastName: "Asante", email: "kwame.asante@gmail.com", phone: "+31 6 8765 4321", country: "NL", countryName: "Netherlands", regionId: "reg-weu", kycTier: "Tier 2", kycStatus: "Pending", monthlyLimit: 25000, currency: "EUR", riskScore: 31, status: "Active", beneficiaryIds: ["BEN-2022"], totalSent: 33400, transferCount: 22, joinedOn: "2025-04-27" },
  { id: "SND-4836", firstName: " Layla", lastName: "Haddad", email: "layla.haddad@gmail.com", phone: "+44 7700 900288", country: "GB", countryName: "United Kingdom", regionId: "reg-weu", kycTier: "Tier 3", kycStatus: "Verified", monthlyLimit: 50000, currency: "GBP", riskScore: 10, status: "Active", beneficiaryIds: ["BEN-2023"], totalSent: 87900, transferCount: 47, joinedOn: "2024-06-09" },
];

export const beneficiaries: Beneficiary[] = [
  { id: "BEN-2001", senderId: "SND-4821", name: "Ngozi Bankole", country: "NG", countryName: "Nigeria", corridorCode: "GB-NG", method: "bank", currency: "NGN", bankName: "GTBank", accountNumber: "••••4471", relationship: "Mother", verification: "Verified", lastPaidOn: "2026-08-09" },
  { id: "BEN-2002", senderId: "SND-4821", name: "Emeka Bankole", country: "NG", countryName: "Nigeria", corridorCode: "GB-NG", method: "wallet", currency: "NGN", walletProvider: "OPay", walletNumber: "••••8823", relationship: "Brother", verification: "Verified", lastPaidOn: "2026-07-28" },
  { id: "BEN-2003", senderId: "SND-4822", name: "Rosa Hernández", country: "MX", countryName: "Mexico", corridorCode: "US-MX", method: "cash", currency: "MXN", pickupProvider: "Elektra", relationship: "Mother", verification: "Verified", lastPaidOn: "2026-08-11" },
  { id: "BEN-2004", senderId: "SND-4823", name: "Arjun Nair", country: "IN", countryName: "India", corridorCode: "GB-IN", method: "bank", currency: "INR", bankName: "HDFC Bank", iban: "••••9021", relationship: "Father", verification: "Verified", lastPaidOn: "2026-08-12" },
  { id: "BEN-2005", senderId: "SND-4823", name: "Lakshmi Nair", country: "IN", countryName: "India", corridorCode: "GB-IN", method: "wallet", currency: "INR", walletProvider: "Paytm", walletNumber: "••••3390", relationship: "Sister", verification: "Pending" },
  { id: "BEN-2006", senderId: "SND-4824", name: "Deepa Iyer", country: "IN", countryName: "India", corridorCode: "DE-IN", method: "bank", currency: "INR", bankName: "ICICI Bank", iban: "••••1145", relationship: "Spouse", verification: "Verified", lastPaidOn: "2026-08-03" },
  { id: "BEN-2007", senderId: "SND-4825", name: "Youssef El Amrani", country: "MA", countryName: "Morocco", corridorCode: "NL-MA", method: "bank", currency: "MAD", bankName: "Attijariwafa", iban: "••••7712", relationship: "Brother", verification: "Verified", lastPaidOn: "2026-08-10" },
  { id: "BEN-2008", senderId: "SND-4825", name: "Nadia El Amrani", country: "MA", countryName: "Morocco", corridorCode: "NL-MA", method: "cash", currency: "MAD", pickupProvider: "CashPlus", relationship: "Mother", verification: "Verified", lastPaidOn: "2026-06-19" },
  { id: "BEN-2009", senderId: "SND-4826", name: "Blessing Okoro", country: "NG", countryName: "Nigeria", corridorCode: "GB-NG", method: "wallet", currency: "NGN", walletProvider: "PalmPay", walletNumber: "••••5567", relationship: "Sister", verification: "Pending" },
  { id: "BEN-2010", senderId: "SND-4827", name: "Carmen Reyes", country: "PH", countryName: "Philippines", corridorCode: "US-PH", method: "wallet", currency: "PHP", walletProvider: "GCash", walletNumber: "••••2201", relationship: "Mother", verification: "Verified", lastPaidOn: "2026-08-13" },
  { id: "BEN-2011", senderId: "SND-4827", name: "Jose Reyes", country: "PH", countryName: "Philippines", corridorCode: "US-PH", method: "cash", currency: "PHP", pickupProvider: "Cebuana Lhuillier", relationship: "Father", verification: "Verified", lastPaidOn: "2026-07-30" },
  { id: "BEN-2012", senderId: "SND-4828", name: "Karim Benali", country: "MA", countryName: "Morocco", corridorCode: "FR-MA", method: "bank", currency: "MAD", bankName: "BMCE Bank", iban: "••••3345", relationship: "Brother", verification: "Verified", lastPaidOn: "2026-08-07" },
  { id: "BEN-2013", senderId: "SND-4829", name: "Meera Patel", country: "IN", countryName: "India", corridorCode: "US-IN", method: "bank", currency: "INR", bankName: "SBI", iban: "••••6678", relationship: "Mother", verification: "Verified", lastPaidOn: "2026-08-12" },
  { id: "BEN-2014", senderId: "SND-4829", name: "Nikhil Patel", country: "IN", countryName: "India", corridorCode: "US-IN", method: "bank", currency: "INR", bankName: "Axis Bank", iban: "••••9934", relationship: "Brother", verification: "Verified", lastPaidOn: "2026-07-25" },
  { id: "BEN-2015", senderId: "SND-4830", name: "Amara Nwankwo", country: "NG", countryName: "Nigeria", corridorCode: "GB-NG", method: "bank", currency: "NGN", bankName: "Access Bank", accountNumber: "••••2290", relationship: "Wife", verification: "Verified", lastPaidOn: "2026-08-08" },
  { id: "BEN-2016", senderId: "SND-4831", name: "Ion Popescu", country: "IN", countryName: "India", corridorCode: "DE-IN", method: "wallet", currency: "INR", walletProvider: "PhonePe", walletNumber: "••••0012", relationship: "Friend", verification: "Rejected" },
  { id: "BEN-2017", senderId: "SND-4832", name: "Kofi Mensah", country: "NG", countryName: "Nigeria", corridorCode: "NL-NG", method: "wallet", currency: "NGN", walletProvider: "OPay", walletNumber: "••••7745", relationship: "Brother", verification: "Verified", lastPaidOn: "2026-08-06" },
  { id: "BEN-2018", senderId: "SND-4833", name: "Samira Benali", country: "MA", countryName: "Morocco", corridorCode: "FR-MA", method: "bank", currency: "MAD", bankName: "Attijariwafa", iban: "••••1123", relationship: "Sister", verification: "Verified", lastPaidOn: "2026-08-11" },
  { id: "BEN-2019", senderId: "SND-4833", name: "Omar Benali", country: "MA", countryName: "Morocco", corridorCode: "FR-MA", method: "cash", currency: "MAD", pickupProvider: "Wafacash", relationship: "Father", verification: "Verified", lastPaidOn: "2026-05-14" },
  { id: "BEN-2020", senderId: "SND-4834", name: "Lucia Cruz", country: "MX", countryName: "Mexico", corridorCode: "US-MX", method: "bank", currency: "MXN", bankName: "BBVA México", accountNumber: "••••8890", relationship: "Mother", verification: "Verified", lastPaidOn: "2026-08-13" },
  { id: "BEN-2021", senderId: "SND-4834", name: "Pedro Cruz", country: "MX", countryName: "Mexico", corridorCode: "US-MX", method: "cash", currency: "MXN", pickupProvider: "OXXO", relationship: "Brother", verification: "Verified", lastPaidOn: "2026-07-19" },
  { id: "BEN-2022", senderId: "SND-4835", name: "Efua Asante", country: "NG", countryName: "Nigeria", corridorCode: "NL-NG", method: "bank", currency: "NGN", bankName: "Zenith Bank", accountNumber: "••••4412", relationship: "Mother", verification: "Pending" },
  { id: "BEN-2023", senderId: "SND-4836", name: "Yasmin Haddad", country: "PH", countryName: "Philippines", corridorCode: "GB-PH", method: "wallet", currency: "PHP", walletProvider: "Maya", walletNumber: "••••6601", relationship: "Sister", verification: "Verified", lastPaidOn: "2026-08-09" },
];

export const partners: PayoutPartner[] = [
  { id: "PTR-001", name: "Paga", legalName: "Pagatech Ltd", country: "NG", countryName: "Nigeria", regionId: "reg-waf", corridors: ["GB-NG"], kybStatus: "Verified", status: "Active", rails: ["BANK", "WALLET", "CASH"], successRate: 98.6, avgPayoutMins: 7, commissionPct: 0.85, contactName: "Tayo Oviosu", contactEmail: "ops@paga.ng", onboardedOn: "2023-04-11", topFailureReason: "Invalid account number" },
  { id: "PTR-002", name: "Moniepoint", legalName: "Moniepoint MFB", country: "NG", countryName: "Nigeria", regionId: "reg-waf", corridors: ["GB-NG", "NL-NG"], kybStatus: "Verified", status: "Active", rails: ["BANK", "WALLET"], successRate: 97.9, avgPayoutMins: 11, commissionPct: 0.9, contactName: "Tosin Eniolorunda", contactEmail: "settle@moniepoint.com", onboardedOn: "2023-07-22", topFailureReason: "Name mismatch" },
  { id: "PTR-003", name: "Zeepay Ghana", legalName: "Zeepay Ghana Ltd", country: "GH", countryName: "Ghana", regionId: "reg-waf", corridors: [], kybStatus: "Pending", status: "Onboarding", rails: ["WALLET"], successRate: 0, avgPayoutMins: 0, commissionPct: 1.1, contactName: "Andrew Takyi-Appiah", contactEmail: "partners@zeepay.me", onboardedOn: "2026-07-30", topFailureReason: "—" },
  { id: "PTR-005", name: "PayNearby", legalName: "Nearby Technologies Pvt Ltd", country: "IN", countryName: "India", regionId: "reg-sasia", corridors: ["GB-IN", "US-IN"], kybStatus: "Verified", status: "Active", rails: ["BANK", "WALLET"], successRate: 99.2, avgPayoutMins: 4, commissionPct: 0.65, contactName: "Anand Kumar", contactEmail: "ops@paynearby.in", onboardedOn: "2023-02-18", topFailureReason: "IFSC invalid" },
  { id: "PTR-006", name: "Airtel Payments", legalName: "Airtel Payments Bank Ltd", country: "IN", countryName: "India", regionId: "reg-sasia", corridors: ["GB-IN", "DE-IN"], kybStatus: "Verified", status: "Active", rails: ["BANK", "WALLET"], successRate: 98.4, avgPayoutMins: 6, commissionPct: 0.7, contactName: "Anubrata Biswas", contactEmail: "b2b@airtelbank.com", onboardedOn: "2023-05-30", topFailureReason: "Wallet limit exceeded" },
  { id: "PTR-008", name: "Elektra Pagos", legalName: "Grupo Elektra SAB", country: "MX", countryName: "Mexico", regionId: "reg-latam", corridors: ["US-MX"], kybStatus: "Verified", status: "Active", rails: ["BANK", "CASH"], successRate: 99.0, avgPayoutMins: 3, commissionPct: 0.8, contactName: "Ricardo Salinas", contactEmail: "pagos@elektra.mx", onboardedOn: "2022-11-14", topFailureReason: "Pickup ID mismatch" },
  { id: "PTR-009", name: "OXXO Pay", legalName: "Cadena Comercial OXXO", country: "MX", countryName: "Mexico", regionId: "reg-latam", corridors: ["US-MX"], kybStatus: "Verified", status: "Active", rails: ["CASH"], successRate: 98.7, avgPayoutMins: 5, commissionPct: 0.95, contactName: "Eduardo Padilla", contactEmail: "network@oxxo.com", onboardedOn: "2023-01-09", topFailureReason: "Branch cash-out delay" },
  { id: "PTR-010", name: "Cebuana Lhuillier", legalName: "PJ Lhuillier Inc", country: "PH", countryName: "Philippines", regionId: "reg-sea", corridors: ["US-PH", "GB-PH"], kybStatus: "Verified", status: "Active", rails: ["BANK", "CASH"], successRate: 99.1, avgPayoutMins: 4, commissionPct: 0.75, contactName: "Jean Henri Lhuillier", contactEmail: "remittance@cebuana.com", onboardedOn: "2022-09-27", topFailureReason: "Recipient unreachable" },
  { id: "PTR-011", name: "GCash Payout", legalName: "G-Xchange Inc", country: "PH", countryName: "Philippines", regionId: "reg-sea", corridors: ["US-PH", "DE-PH"], kybStatus: "Verified", status: "Active", rails: ["WALLET"], successRate: 99.3, avgPayoutMins: 2, commissionPct: 0.6, contactName: "Martha Sazon", contactEmail: "payout@gcash.com", onboardedOn: "2023-03-05", topFailureReason: "Wallet not activated" },
  { id: "PTR-012", name: "Palawan Express", legalName: "Palawan Pawnshop Inc", country: "PH", countryName: "Philippines", regionId: "reg-sea", corridors: [], kybStatus: "Pending", status: "Onboarding", rails: ["CASH"], successRate: 0, avgPayoutMins: 0, commissionPct: 0.9, contactName: "Bobby Castro", contactEmail: "partners@palawanexpress.com", onboardedOn: "2026-08-01", topFailureReason: "—" },
  { id: "PTR-013", name: "CashPlus Maroc", legalName: "CashPlus SA", country: "MA", countryName: "Morocco", regionId: "reg-nafr", corridors: ["NL-MA", "GB-MA"], kybStatus: "Verified", status: "Active", rails: ["BANK", "CASH"], successRate: 97.1, avgPayoutMins: 9, commissionPct: 1.0, contactName: "Nabil Adel", contactEmail: "ops@cashplus.ma", onboardedOn: "2023-08-19", topFailureReason: "Branch closed" },
  { id: "PTR-014", name: "Wafacash", legalName: "Wafacash SA", country: "MA", countryName: "Morocco", regionId: "reg-nafr", corridors: ["NL-MA", "FR-MA"], kybStatus: "Verified", status: "Active", rails: ["BANK", "CASH"], successRate: 98.2, avgPayoutMins: 6, commissionPct: 0.9, contactName: "Samira Khamlichi", contactEmail: "settle@wafacash.ma", onboardedOn: "2023-06-12", topFailureReason: "ID document expired" },
];

// Float accounts generated per active partner × covered corridor, with a few Low/Critical.
function currencyForCorridor(code: string): Currency {
  return corridors.find((c) => c.code === code)?.receiveCurrency ?? "USD";
}

export const floatAccounts: FloatAccount[] = (() => {
  const rows: FloatAccount[] = [];
  const forced: Record<string, "Low" | "Critical"> = {
    "PTR-013|NL-MA": "Critical",
    "PTR-002|NL-NG": "Low",
    "PTR-006|DE-IN": "Low",
  };
  for (const p of partners) {
    for (const code of p.corridors) {
      const seed = `${p.id}|${code}`;
      const r = seededRand(seed);
      const currency = currencyForCorridor(code);
      const target = Math.round((300_000 + r * 1_400_000) / 1000) * 1000;
      let utilisation = 20 + Math.round(r * 55);
      const state = forced[seed];
      if (state === "Critical") utilisation = 94;
      if (state === "Low") utilisation = 82;
      const balance = Math.round(target * (1 - utilisation / 100));
      const status: FloatAccount["status"] =
        utilisation >= 90 ? "Critical" : utilisation >= 78 ? "Low" : "Healthy";
      rows.push({
        id: `FLT-${p.id.slice(4)}-${code}`,
        partnerId: p.id,
        corridorCode: code,
        currency,
        balance,
        prefunded: target,
        minThreshold: Math.round(target * 0.15),
        targetBalance: target,
        utilisation,
        status,
        lastToppedUp: r > 0.5 ? "2026-08-12" : "2026-08-08",
      });
    }
  }
  return rows;
})();

export type AgeMode = 'junior' | 'engineer';
export type Language = 'vi' | 'en';
export type AcademyZone =
  | 'lobby'
  | 'mission_map'
  | 'design_lab'
  | 'launch_center'
  | 'simulator'
  | 'repair_shop'
  | 'nasa_center'
  | 'achievements';

export type CadetRank = 'Intern' | 'Junior Engineer' | 'Professional Engineer' | 'Master Engineer';

export interface CadetProfile {
  name: string;
  callsign: string;
  avatar: string;
  ageMode: AgeMode;
  xp: number;
  rank: CadetRank;
  unlockedBadges: string[];
  completedMissions: string[];
  totalPhotosTaken: number;
  totalSamplesAnalyzed: number;
  anomaliesResolved: number;
}

export type MissionId =
  | 'mission_01_mars_rover'
  | 'mission_02_earth_satellite'
  | 'mission_03_space_station'
  | 'mission_04_robotic_arm'
  | 'mission_05_space_telescope';

export type MissionStage = 'discover' | 'design' | 'resources' | 'launch' | 'simulate' | 'repair' | 'debrief';

export type ComponentCategory =
  | 'chassis'
  | 'mobility'
  | 'camera'
  | 'antenna'
  | 'power'
  | 'battery'
  | 'science'
  | 'thruster'
  | 'computer';

export interface SpacecraftComponent {
  id: string;
  category: ComponentCategory;
  name: { vi: string; en: string };
  desc: { vi: string; en: string };
  icon: string;
  massKg: number;
  costK: number;
  powerDrawW: number;
  powerGenW: number;
  batteryCapacityWh: number;
  scienceValue: number;
  speedRating?: number;
  ruggedness?: number;
  compatibilityNote?: { vi: string; en: string };
  nasaHeritage?: { vi: string; en: string };
}

export interface MissionDesign {
  chassis?: SpacecraftComponent;
  mobility?: SpacecraftComponent;
  camera?: SpacecraftComponent;
  antenna?: SpacecraftComponent;
  power?: SpacecraftComponent;
  battery?: SpacecraftComponent;
  science?: SpacecraftComponent;
  computer?: SpacecraftComponent;
  thruster?: SpacecraftComponent;
}

export interface ResourceSummary {
  totalMass: number;
  maxMass: number;
  totalCost: number;
  maxBudget: number;
  netPower: number; // powerGen - powerDraw
  totalBattery: number;
  totalScience: number;
  commsScore: number;
  isCompatible: boolean;
  issues: { vi: string; en: string }[];
}

export interface AnomalyScenario {
  id: string;
  title: { vi: string; en: string };
  symptom: { vi: string; en: string };
  subsystem: ComponentCategory;
  telemetryClue: { vi: string; en: string };
  options: {
    id: string;
    text: { vi: string; en: string };
    isCorrect: boolean;
    explanation: { vi: string; en: string };
  }[];
  nasaContext: { vi: string; en: string };
}

export interface MissionConfig {
  id: MissionId;
  number: string;
  title: { vi: string; en: string };
  subtitle: { vi: string; en: string };
  briefing: { vi: string; en: string };
  nasaContext: { vi: string; en: string };
  targetLocation: { vi: string; en: string };
  nasaDatasetRef: string;
  badgeId: string;
  badgeName: { vi: string; en: string };
  badgeDesc: { vi: string; en: string };
  budgetMax: { junior: number; engineer: number };
  massMax: { junior: number; engineer: number };
  scienceTarget: number;
  anomalies: AnomalyScenario[];
  reflectionQuestion: { vi: string; en: string };
  reflectionAnswer: { vi: string; en: string };
}

export interface Badge {
  id: string;
  name: { vi: string; en: string };
  desc: { vi: string; en: string };
  icon: string;
  category: 'mission' | 'engineering' | 'science';
  unlockedAt?: string;
}

export type KnowledgeAccuracyTag = 'FACT' | 'GAME SIMULATION' | 'SIMPLIFIED FOR LEARNING';
export type MediaKind = 'real_photo' | 'technical_diagram' | 'illustration';
export type GalleryViewCategory =
  | 'overview'
  | 'closeup'
  | 'operation'
  | 'anatomy'
  | 'principle'
  | 'mission_result';

export interface NasaReferenceLink {
  title: string;
  organization: 'NASA' | 'NASA/JPL' | 'USGS' | 'Canadian Space Agency' | 'NASA / ESA';
  url: string;
  note?: { vi: string; en: string };
}

export interface SpacecraftGalleryImage {
  url: string;
  fallbackUrl: string;
  title: { vi: string; en: string };
  caption: { vi: string; en: string };
  sourceLabel: string;
  mediaKind?: MediaKind;
  viewCategory?: GalleryViewCategory;
}

export interface EquipmentMissionGoal {
  icon: string;
  title: { vi: string; en: string };
  desc: { vi: string; en: string };
}

export interface EquipmentWorkflowStep {
  step: number;
  title: { vi: string; en: string };
  desc: { vi: string; en: string };
  icon: string;
}

export interface SpacecraftComponentDetail {
  id: string;
  name: string;
  displayName?: { vi: string; en: string };
  shortDesc: { vi: string; en: string };
  functionDesc: { vi: string; en: string };
  analogy: { vi: string; en: string };
  icon: string;
  imageUrl?: string;
  isRealPhoto?: boolean;
  mediaKind?: MediaKind;
  locationCallout?: { vi: string; en: string };
  hotspotCoords?: { x: number; y: number };
  imageCaption?: { vi: string; en: string };
  accuracy: KnowledgeAccuracyTag;
  sourceIndex?: number;
}

export type PreschoolIllustrationKind =
  | 'antenna'
  | 'solar_wings'
  | 'truss'
  | 'battery'
  | 'camera_eye'
  | 'balance_wheel';

export interface PreschoolPartItem {
  id: string;
  simpleName: { vi: string; en: string };
  shortRole: { vi: string; en: string };
  voiceLine: { vi: string; en: string };
  imageUrl?: string;
  isRealPhoto: boolean;
  mediaKind?: MediaKind;
  locationCallout?: { vi: string; en: string };
  hotspotCoords?: { x: number; y: number };
  illustrationKind?: PreschoolIllustrationKind;
  icon: string;
  sourceIndex?: number;
}

export interface PreschoolEquipmentGuide {
  simpleName: { vi: string; en: string };
  badgeEmoji: string;
  whatIsItSpeech: { vi: string; en: string };
  usedForShort: { vi: string; en: string };
  usedForSpeech: { vi: string; en: string };
  parts: PreschoolPartItem[];
  funFact: { vi: string; en: string };
  funFactSpeech: { vi: string; en: string };
}

export interface MissionEquipmentProfile {
  missionId: MissionId;
  missionNumber: string;
  equipmentName: { vi: string; en: string };
  agency: string;
  heroImageUrl: string;
  fallbackImageUrl: string;
  anatomyImageUrl?: string;
  whereItOperates: { vi: string; en: string };
  shortTypeSummary: { vi: string; en: string };
  launchAndOrbit: { vi: string; en: string };
  galleryImages: SpacecraftGalleryImage[];
  preschool: PreschoolEquipmentGuide;
  introKid: {
    whatIsIt: { vi: string; en: string };
    purpose: { vi: string; en: string };
    howItWorks: { vi: string; en: string };
    missionObjectives: EquipmentMissionGoal[];
    workflowSteps: EquipmentWorkflowStep[];
    keyParts: {
      name: string;
      role: { vi: string; en: string };
    }[];
    funFacts: { vi: string[]; en: string[] };
  };
  detailedArchive: {
    overview: { vi: string; en: string };
    missionAndPurpose: { vi: string; en: string };
    operatingPrinciple: { vi: string; en: string };
    technicalHighlight: {
      title: { vi: string; en: string };
      content: { vi: string; en: string };
    };
    simulationNote: { vi: string; en: string };
    components: SpacecraftComponentDetail[];
  };
  sources: NasaReferenceLink[];
}

export type DifficultyLevel = 1 | 2 | 3 | 4;

export type PartTier = 'economy' | 'standard' | 'premium';

export type SubsystemHealthStatus = 'ok' | 'degraded' | 'failed';

export type EquipmentSubsystemId =
  | 'rover_mobility'
  | 'rover_camera'
  | 'rover_arm'
  | 'rover_comms'
  | 'rover_power'
  | 'sat_oli'
  | 'sat_tirs'
  | 'sat_processor'
  | 'sat_comms'
  | 'sat_power'
  | 'iss_power'
  | 'iss_thermal'
  | 'iss_comms'
  | 'iss_lifesupport'
  | 'arm_shoulder'
  | 'arm_elbow'
  | 'arm_wrist'
  | 'arm_camera'
  | 'hst_optics'
  | 'hst_guidance'
  | 'hst_power'
  | 'hst_computer';

export interface EngineeringPart {
  id: string;
  subsystemId: EquipmentSubsystemId;
  tier: PartTier;
  name: string;
  nameEn?: string;
  shortDesc: string;
  shortDescEn?: string;
  tradeoffNote: string;
  tradeoffNoteEn?: string;
  purchaseCost: number;
  maintenanceCost: number;
  durability: number; // 0-100
  performance: number; // 0-100
  reliability: number; // 0-100
  powerDrawW: number;
  powerGenW: number;
  compatibleMissions: MissionId[];
  incompatibleReason?: string;
  incompatibleReasonEn?: string;
}

export interface SubsystemBlueprint {
  id: EquipmentSubsystemId;
  missionId: MissionId;
  name: string;
  nameEn?: string;
  role: string;
  roleEn?: string;
  icon: string;
  dependsOn: EquipmentSubsystemId[];
  affectedFunctions: string[];
  affectedFunctionsEn?: string[];
  hotspotCoords: { x: number; y: number };
  criticality: 'core' | 'support';
  idealTier: PartTier;
}

export interface SubsystemRuntimeState {
  subsystemId: EquipmentSubsystemId;
  partId: string;
  health: number; // 0-100
  status: SubsystemHealthStatus;
  faultTitle?: string;
  faultTitleEn?: string;
  faultCause?: string;
  faultCauseEn?: string;
  diagnosed?: boolean;
}

export interface MissionEconomyState {
  difficulty: DifficultyLevel;
  initialBudget: number;
  partsCost: number;
  repairCost: number;
  maintenanceCost: number;
  operatingCost: number;
  failurePenalty: number;
}

export interface SafetyCheckItem {
  id: string;
  label: string;
  level: 'ok' | 'warn' | 'fail';
  detail: string;
}

export interface SafetyGateReport {
  status: 'READY' | 'WARNING' | 'FAILED';
  checks: SafetyCheckItem[];
  summary: string;
  safetyPct: number;
  performancePct: number;
  durabilityPct: number;
  reliabilityPct: number;
  netPowerW: number;
}

export type NasaAssetType =
  | 'REAL_PHOTO'
  | 'TECHNICAL_DIAGRAM'
  | 'SCIENTIFIC_DATA'
  | 'SIMPLIFIED_DIAGRAM'
  | 'UI_ICON';

export interface VerifiedNasaAsset {
  assetId: string;
  deviceId: MissionId;
  componentId?: string;
  title: string;
  titleEn?: string;
  imageUrl: string;
  fallbackImageUrl?: string;
  sourcePage: string;
  sourceOrganization: 'NASA' | 'NASA / JPL' | 'NASA / USGS' | 'USGS' | 'Canadian Space Agency' | 'NASA / ESA';
  imageType: NasaAssetType;
  caption: string;
  captionEn?: string;
  attribution: string;
  license: string;
  verified: boolean;
  resolution?: string;
  usageContext: string;
}

export interface CostHistoryEntry {
  id: string;
  label: string;
  labelEn?: string;
  category: 'purchase' | 'repair' | 'maintenance' | 'operating' | 'penalty';
  amount: number;
}

export interface BudgetFailureInfo {
  failed: true;
  initialBudget: number;
  totalCost: number;
  overrunAmount: number;
  triggerDecision: string;
  triggerDecisionEn?: string;
  topExpenses: { label: string; amount: number }[];
  overBudgetDecisions: string[];
  advice: string;
}

export interface MissionSessionState {
  missionId: MissionId;
  difficulty: DifficultyLevel;
  subsystems: Record<string, SubsystemRuntimeState>;
  economy: MissionEconomyState;
  costHistory?: CostHistoryEntry[];
  budgetFailure?: BudgetFailureInfo | null;
  completedSubTasks: string[];
  failedSubTasks?: string[];
  diagnosisAttempts: number;
  diagnosisCorrect: number;
  incidentsTriggered: number;
  safetyWarningsIgnored: number;
  safetyChecksRun: number;
  preDeployReport: SafetyGateReport | null;
}

export interface MissionEvaluationReport {
  xpEarned: number;
  finalScore: number; // 0-100
  passed: boolean;
  budgetExceeded?: boolean;
  overrunAmount?: number;
  outcomeTitle: string;
  totalCost: number;
  initialBudget: number;
  performancePct: number;
  safetyPct: number;
  completionPct: number;
  diagnosisAccuracyPct: number;
  goodChoices: string[];
  suboptimalChoices: string[];
  technicalLesson: string;
  photos: number;
  samples: number;
}



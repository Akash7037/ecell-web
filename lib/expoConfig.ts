export interface ExpoTrack {
  code: string;
  name: string;
  tagline: string;
  description: string;
  labTools: string;
}

export interface ExpoConfig {
  title: string;
  subtitle: string;
  dateStatus: string;
  location: string;
  prizePool: string;
  description: string;
  eligibility: string;
  tracks: ExpoTrack[];
}

export const defaultExpoConfig: ExpoConfig = {
  title: "Project Expo '26",
  subtitle: "Flagship Inter-Collegiate Engineering Prototype & Innovation Summit",
  dateStatus: "Dates Announcing Soon",
  location: "Main Auditorium & Innovation Labs, VSBCETC, Coimbatore",
  prizePool: "₹3.5L+",
  description: "Project Expo '26 is the premier engineering prototype and venture showcase hosted by VSB College of Engineering Technical Campus (VSBCETC), Coimbatore. Students present tangible hardware innovations, functional software platforms, and patentable inventions before industrial leaders, angel investors, and evaluators.",
  eligibility: "Open to all Undergraduate & Postgraduate engineering teams (1 to 4 members). Working physical model or functional software demo required.",
  tracks: [
    {
      code: "01",
      name: "Hardware & IoT Systems",
      tagline: "Physical computing, embedded telemetry & custom silicon",
      description: "Embedded telemetry, microcontrollers, smart sensor arrays, industrial automation, and custom PCB prototypes designed for real operational environments.",
      labTools: "SLA 3D Printers, CNC Routers, Digital Storage Oscilloscopes, PCB Etching",
    },
    {
      code: "02",
      name: "Autonomous Robotics & EV",
      tagline: "Kinetic machines, powertrain architecture & rovers",
      description: "Autonomous agricultural rovers, drone navigation systems, electric vehicle powertrain concepts, and rapid CNC mechatronic assemblies.",
      labTools: "Motor Dynamometers, LiFePO4 Battery Test Rigs, LoRa Telemetry Benches",
    },
    {
      code: "03",
      name: "AgTech & Clean Energy",
      tagline: "Decarbonization, textile effluent & smart soil sensors",
      description: "Sustainable energy harvesters, textile processing telemetry, smart drip irrigation controllers, and circular engineering prototypes rooted in the Coimbatore industrial corridor.",
      labTools: "Soil Spectrometers, Water Purity Analyzers, Solar MPPT Emulators",
    },
    {
      code: "04",
      name: "Neural AI & Enterprise Code",
      tagline: "Computer vision, edge inference & patent intelligence",
      description: "Automated patent prior-art classification, computer vision diagnostic models for industrial textile quality control, and distributed enterprise platforms.",
      labTools: "GPU Workstations, TensorRT Inference Rigs, Distributed Test Clusters",
    },
  ],
};

import { Project } from "./api/types";
import CloudsView from "./views/CloudsView";
import NoCloudsView from "./views/NoCloudsView";

export default function Page() {
  const projects: Project[] = [
    {
      id: "1",
      name: "Cloud Refit Project",
      status: "connected",
      statusLabel: "Connected",
      potentialSavings: {
        amount: 620,
        percentage: 14,
      },
      monthlyCost: 4230,
      reports: 6,
      dataFreshness: "Good",
      cloudService: "azure",
    },
    {
      id: "2",
      name: "Taqneen Project",
      status: "malfunctioned",
      statusLabel: "Malfunctioned",
      potentialSavings: {
        amount: 620,
        percentage: 14,
      },
      monthlyCost: 4230,
      reports: 6,
      dataFreshness: "Good",
      cloudService: "aws",
    },
    {
      id: "3",
      name: "AlMohami pro",
      status: "issued",
      statusLabel: "Issued",
      potentialSavings: {
        amount: 620,
        percentage: 14,
      },
      monthlyCost: 4230,
      reports: 6,
      dataFreshness: "Good",
      cloudService: "gcp",
    },
  ];
  if (projects.length <= 0) return <NoCloudsView />;
  else return <CloudsView projects={projects} />;
}

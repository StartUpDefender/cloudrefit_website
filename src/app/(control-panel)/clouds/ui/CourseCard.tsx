import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Link from "@fuse/core/Link";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { lighten } from "@mui/material/styles";
import CourseInfo from "./CourseInfo";
import { Project } from "../api/types";

type CourseCardProps = {
  project: Project;
};

/**
 * The CourseCard component.
 */
function ProjectCard(props: CourseCardProps) {
  const { project } = props;

  function serviceImg() {
    switch (project.cloudService) {
      case "azure":
        return "assets/images/logo/azure.svg";
      case "aws":
        return "assets/images/logo/aws.svg";
      case "gcp":
        return "assets/images/logo/GCP.svg";
      default:
        return "assets/images/logo/azure.svg";
    }
  }

  return (
    <Card className="flex h-60 flex-col shadow-sm md:h-80 ">
      <CardContent className="flex flex-auto flex-col p-4">
        <div className="mx-auto h-28 w-44">
          <img className="h-full w-full" src={serviceImg()} alt="cloud" />
        </div>
        <CourseInfo project={project} />
      </CardContent>
      {/* <CourseProgress course={project} /> */}
      {/* <CardActions
        className="items-center justify-end px-4 py-4"
        sx={(theme) => ({
          backgroundColor: lighten(theme.palette.background.default, 0.03),
          ...theme.applyStyles("light", {
            backgroundColor: lighten(theme.palette.background.default, 0.4),
          }),
        })}
      >
        <Button
          to={`/apps/academy/courses/${project.id}`}
          component={Link}
          className="px-3"
          color="secondary"
          variant="contained"
          size="small"
          endIcon={<FuseSvgIcon>lucide:arrow-right</FuseSvgIcon>}
        >
          {buttonStatus()}
        </Button>
      </CardActions> */}
    </Card>
  );
}

export default ProjectCard;

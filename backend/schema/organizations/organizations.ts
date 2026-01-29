//** To create Organization Table in DB
export {
  createOrganization,
  organizationStatusEnum,
} from "./createOrganization";

//** To delete or change status of an organization Logs

export { organizationStatusLogs } from "./deleteOrganization";

//** Fetch all the Organization Data

export { organizationsData } from "./selectOrganization";

//** Update the organization Name Logs

export { organizationEditLogs } from "./updateOrganization";

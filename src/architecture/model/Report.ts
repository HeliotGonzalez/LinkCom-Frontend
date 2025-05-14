import { IdentityType } from "./IdentityType";
import { ReportType } from "./ReportType";

export interface Report {
    id?: string;
    identity_type: IdentityType;
    identity_id: string;
    user_id: string;
    report_content: string;
    report_type: ReportType[];
    message: string;
}
import { Link } from 'react-router-dom'
import { profilePath } from '../../../../constants/routes'
import { formatDate } from '../../../../utils/format'
import { REPORT_REASONS } from '../../../social/constants'
import { REPORT_STATUS } from '../../constants'
import Avatar from '../../../../components/common/Avatar'
import Badge from '../../../../components/common/Badge'
import Button from '../../../../components/common/Button'
import Card from '../../../../components/common/Card'
import './ReportItem.css'

const reasonLabel = (r) => REPORT_REASONS.find((x) => x.value === r)?.label ?? r

// AdminReportResponse
export default function ReportItem({ report, onReview }) {
  const status = REPORT_STATUS[report.status]

  return (
    <Card className="report-item">
      <div className="report-item__head">
        <Badge tone="danger">{reasonLabel(report.reason)}</Badge>
        {status && <Badge tone={status.tone}>{status.label}</Badge>}
        <span className="report-item__date">
          {formatDate(report.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      </div>

      <div className="report-item__people">
        <div>
          <span className="report-item__role">Reportado</span>
          <Link to={profilePath(report.reported.username)} className="report-item__user">
            <Avatar src={report.reported.avatarUrl} name={report.reported.displayName} size={32} />
            <span>
              <strong>{report.reported.displayName}</strong> @{report.reported.username}
            </span>
          </Link>
        </div>
        <div>
          <span className="report-item__role">Por</span>
          <Link to={profilePath(report.reporter.username)} className="report-item__user">
            <Avatar src={report.reporter.avatarUrl} name={report.reporter.displayName} size={32} />
            <span>@{report.reporter.username}</span>
          </Link>
        </div>
      </div>

      {report.description && <p className="report-item__description">“{report.description}”</p>}

      {report.resolutionNote && (
        <p className="report-item__resolution">
          <strong>Resolución:</strong> {report.resolutionNote}
          {report.reviewedAt && ` · ${formatDate(report.reviewedAt, { dateStyle: 'medium' })}`}
        </p>
      )}

      {report.status === 'PENDING' && onReview && (
        <div>
          <Button size="sm" onClick={() => onReview(report)}>
            Revisar
          </Button>
        </div>
      )}
    </Card>
  )
}

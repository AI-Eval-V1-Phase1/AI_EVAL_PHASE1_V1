import { useCallback, useEffect, useState } from "react"
import { BarChart3, BotIcon, MessageSquare, Send, Swords } from "lucide-react"
import Select from "../../UI/Select"
import Input from "../../UI/Input"
import Button from "../../UI/Button"
import ChatMessage from "../../UI/ChatMessage"
import "../UserManagement/user_management.css"
import "./sales_enablement.css"

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1"

interface AssessmentRow {
  assessmentId: number
  type: string
  status: string
  organizationId?: string | null
  productName?: string | null
  vendorName?: string | null
  customerOrganizationName?: string | null
  customerSector?: string | null
  [key: string]: unknown
}

function getVendorAssessmentLabel(a: AssessmentRow): string {
  const org = (a.customerOrganizationName ?? "").toString().trim()
  const sector = (a.customerSector ?? "").toString().trim()
  if (org && sector) return `${org} – ${sector}`
  if (org) return org
  if (sector) return sector
  const product = (a.productName ?? "").toString().trim()
  const vendor = (a.vendorName ?? "").toString().trim()
  if (product && vendor) return `${product} – ${vendor}`
  if (product) return product
  if (vendor) return vendor
  return `Vendor assessment #${a.assessmentId}`
}

const GREETING =
  "Hello! I'm your AI Sales Enablement Agent. Select a vendor assessment from your completed evaluations and I can help you with SWOT analysis, battle card generation, or answer questions about their compliance posture."

const QUICK_ACTIONS = [
  { label: "Generate SWOT Analysis", icon: BarChart3 },
  { label: "Create Battle Card", icon: Swords },
]

const EXAMPLE_QUESTIONS = [
  "How should I address buyer concerns about data security and compliance?",
  "What compliance certifications can I highlight to this customer?",
  "How do I handle objections about AI risk from buyers?",
]

export function SalesEnablement() {
  const [assessmentsList, setAssessmentsList] = useState<AssessmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<{ role: "agent" | "user"; text: string }[]>([])

  const fetchAssessments = useCallback(() => {
    const token = sessionStorage.getItem("bearerToken")
    if (!token) {
      setLoading(false)
      return
    }
    const organizationId = sessionStorage.getItem("organizationId")
    const query = organizationId
      ? `?organizationId=${encodeURIComponent(organizationId)}`
      : ""
    fetch(`${BASE_URL}/assessments${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.data?.assessments != null) {
          setAssessmentsList(result.data.assessments as AssessmentRow[])
        } else {
          setAssessmentsList([])
        }
      })
      .catch(() => setAssessmentsList([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchAssessments()
  }, [fetchAssessments])

  const completedVendorAssessments = assessmentsList.filter(
    (a) =>
      (a.type ?? "").toLowerCase() === "cots_vendor" &&
      (a.status ?? "").toLowerCase() !== "draft"
  )

  const selectOptions = completedVendorAssessments.map((a) => ({
    value: String(a.assessmentId),
    label: getVendorAssessmentLabel(a),
  }))

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssessmentId(e.target.value)
  }

  const handleSend = () => {
    const text = messageInput.trim()
    if (!text) return
    setMessages((prev) => [...prev, { role: "user", text }])
    setMessageInput("")
    // TODO: call chat API with selectedAssessmentId and text; append agent reply
  }

  const handleExampleClick = (question: string) => {
    setMessageInput(question)
  }

  return (
    <div className="sec_user_page org_settings_page sales_enablement_page">
      <div className="heading_user_page page_header_align">
        <div className="headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <BotIcon size={24} className="header_icon_svg"/>
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Sales Enablement Agent</h1>
            <p className="sub_title page_header_subtitle">
              AI-powered sales assistance with SWOT analysis, battle cards, and Q&A.
            </p>
          </div>
        </div>
        <div className="btn_user_page sales_enablement_select_wrapper">
          <Select
            id="vendor_assessment"
            name="vendor_assessment"
            labelName=""
            value={selectedAssessmentId}
            default_option="Select a vendor assessment"
            options={selectOptions}
            onChange={handleSelectChange}
          />
        </div>
      </div>

      <div className="sales_enablement_section">
        <div className="sales_enablement_chat_layout">
        <div className="sales_enablement_chat_main">
          <div className="sales_enablement_messages">
            <ChatMessage
              role="agent"
              icon={<BotIcon size={18} />}
              title="AI Sales Assistant"
              subtitle="Powered by vendor attestations & risk data."
            >
              {GREETING}
            </ChatMessage>
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role}>
                {msg.text}
              </ChatMessage>
            ))}
          </div>
          <div className="sales_enablement_input_row">
            <Input
              id="sales_enablement_message"
              labelName=""
              name="message"
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              required={false}
              placeholder="Ask how to address buyer concerns, handle objections, or position your solution..."
            />
            <Button
              type="button"
              className="sales_enablement_send_btn"
              onClick={handleSend}
              disabled={!messageInput.trim()}
            >
              <Send size={20} aria-hidden />
            </Button>
          </div>
        </div>

        <aside className="sales_enablement_sidebar">
          <div className="sales_enablement_sidebar_card">
            <h3 className="sales_enablement_sidebar_title">Quick Actions</h3>
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  type="button"
                  className="sales_enablement_quick_action_btn"
                  onClick={() => setMessageInput(action.label)}
                >
                  <Icon size={18} aria-hidden />
                  {action.label}
                </Button>
              )
            })}
          </div>
          <div className="sales_enablement_sidebar_card">
            <h3 className="sales_enablement_sidebar_title">Example Questions</h3>
            <ul className="sales_enablement_example_list">
              {EXAMPLE_QUESTIONS.map((q, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="sales_enablement_example_btn"
                    onClick={() => handleExampleClick(q)}
                  >
                    <MessageSquare size={16} aria-hidden />
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        </div>
      </div>
    </div>
  )
}

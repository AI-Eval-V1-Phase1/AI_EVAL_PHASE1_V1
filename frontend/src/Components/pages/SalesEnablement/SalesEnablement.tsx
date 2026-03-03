import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart3,
  BotIcon,
  FileCheck,
  FileText,
  FileWarning,
  Lightbulb,
  Loader2,
  MessageSquare,
  Send,
  Square,
  Swords,
  Target,
  TrendingDown,
  TrendingUp,
  TrendingUpDown,
  TriangleAlert,
  User,
} from "lucide-react";
import Select from "../../UI/Select";
import Input from "../../UI/Input";
import Button from "../../UI/Button";
import ChatMessage from "../../UI/ChatMessage";
import ClickTooltip from "../../UI/ClickTooltip";
import "../UserManagement/user_management.css";
import "./sales_enablement.css";

const BASE_URL =
  import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

interface AssessmentRow {
  assessmentId: number;
  type: string;
  status: string;
  organizationId?: string | null;
  productName?: string | null;
  vendorName?: string | null;
  customerOrganizationName?: string | null;
  customerSector?: string | null;
  product_in_scope?: string | null;
  productInScope?: string | null;
  [key: string]: unknown;
}

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface BattleCardQa {
  question: string;
  answer: string;
}

interface BattleCardData {
  title: string;
  keyDifferentiators?: string[];
  complianceHighlights?: string[];
  objectionHandling?: { question: string; answer: string };
  qaBlocks?: BattleCardQa[];
  idealCustomerProfile?: string;
  /** Legacy: simple bullets if new fields not provided */
  bullets?: string[];
}

interface ChatMessageItem {
  role: "agent" | "user";
  text?: string;
  swot?: SwotData;
  battleCard?: BattleCardData;
}

function getVendorAssessmentLabel(a: AssessmentRow): string {
  const org = (a.customerOrganizationName ?? "").toString().trim();
  const productInScope =
    (a.product_in_scope ?? a.productInScope ?? "").toString().trim();
  if (org && productInScope) return `${org} and ${productInScope}`;
  if (org) return org;
  if (productInScope) return productInScope;
  const product = (a.productName ?? "").toString().trim();
  const vendor = (a.vendorName ?? "").toString().trim();
  if (product && vendor) return `${product} – ${vendor}`;
  if (product) return product;
  if (vendor) return vendor;
  return `Vendor assessment #${a.assessmentId}`;
}

const GREETING =
  "Hello! I'm your AI Sales Enablement Agent. Select a vendor assessment from your completed evaluations and I can help you with SWOT analysis, battle card generation, or answer questions about their compliance posture.";

/** Dummy SWOT data for UI pass; replace with API response when backend is ready */
const DUMMY_SWOT: SwotData = {
  strengths: [
    "Established presence in the AI industry with a focus on building safe AGI.",
    "Offers a suite of products including GPT-4o and ChatGPT Enterprise, catering to a wide range of enterprise needs.",
    "Strong security and compliance credentials.",
  ],
  weaknesses: [
    "High dependency on cloud infrastructure and partners like Azure, which may limit control over deployment environments.",
    "Potentially high operational costs associated with maintaining compliance and security standards across multiple certifications.",
  ],
  opportunities: [
    "Growing demand for enterprise AI solutions in regulated sectors.",
    "Partnership opportunities with government and public sector for compliant AI deployment.",
  ],
  threats: [
    "Evolving regulatory landscape may require continuous compliance updates.",
    "Competitive pressure from other AI vendors with similar compliance offerings.",
  ],
};

/** Dummy battle card for UI pass – matches screenshot layout */
const DUMMY_BATTLE_CARD: BattleCardData = {
  title:
    "Trust and Reliability in AI: Commonwealth of Pennsylvania's Enterprise-Grade Solution",
  keyDifferentiators: [
    "Enterprise-grade security with industry certifications",
    "Strong regulatory compliance with no identified gaps",
    "High operational reliability backed by strong SLA performance",
    "Comprehensive data governance with no concerns",
  ],
  complianceHighlights: [
    "Strong regulatory compliance with industry certifications",
    "No compliance gaps identified, ensuring adherence to all relevant requirements",
  ],
  objectionHandling: {
    question: "How can we be sure of the security of our data?",
    answer:
      "Commonwealth of Pennsylvania offers enterprise-grade security with industry certifications, ensuring top-tier protection for your data.",
  },
  qaBlocks: [
    {
      question: "What if the system becomes unreliable during critical operations?",
      answer:
        "The solution boasts high operational reliability with strong SLA performance, ensuring consistent and dependable service.",
    },
  ],
  idealCustomerProfile:
    "Large enterprises or government agencies requiring robust security, compliance, and reliability in their AI deployments.",
};

const QUICK_ACTIONS = [
  { label: "Generate SWOT Analysis", icon: BarChart3, key: "swot" as const },
  { label: "Create Battle Card", icon: Swords, key: "battlecard" as const },
  {
    label: "View Sales Reports & Briefs",
    icon: FileText,
    key: "reports" as const,
  },
];

const EXAMPLE_QUESTIONS = [
  "How should I address buyer concerns about data security and compliance?",
  "What compliance certifications can I highlight to this customer?",
  "How do I handle objections about AI risk from buyers?",
];

const SWOT_QUESTION = "Generate a SWOT analysis for my sales positioning.";
const BATTLE_CARD_QUESTION = "Create a battle card for my sales positioning.";

export function SalesEnablement() {
  useEffect(() => {
    document.title = "AI Eval | Sales Agent";
  },[]);
  const [assessmentsList, setAssessmentsList] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const pendingAgentMessageRef = useRef<ChatMessageItem | null>(null);

  const quickActionsEnabled = !!selectedAssessmentId;

  const fetchAssessments = useCallback(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setLoading(false);
      return;
    }
    const organizationId = sessionStorage.getItem("organizationId");
    const query = organizationId
      ? `?organizationId=${encodeURIComponent(organizationId)}`
      : "";
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
          setAssessmentsList(result.data.assessments as AssessmentRow[]);
        } else {
          setAssessmentsList([]);
        }
      })
      .catch(() => setAssessmentsList([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const completedVendorAssessments = assessmentsList.filter(
    (a) =>
      (a.type ?? "").toLowerCase() === "cots_vendor" &&
      (a.status ?? "").toLowerCase() !== "draft",
  );

  console.log("assesments", completedVendorAssessments)

  const selectOptions = completedVendorAssessments.map((a) => ({
    value: String(a.assessmentId),
    label: getVendorAssessmentLabel(a),
  }));

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssessmentId(e.target.value);
  };

  const handleSend = () => {
    const text = messageInput.trim();
    if (!text || isGenerating) return;

    const lower = text.toLowerCase();
    const isSwot =
      text === SWOT_QUESTION ||
      (lower.includes("swot") && lower.includes("analysis"));
    const isBattleCard =
      text === BATTLE_CARD_QUESTION || lower.includes("battle card");

    if (isSwot) {
      pendingAgentMessageRef.current = {
        role: "agent",
        text: "Here's your sales positioning SWOT analysis - use these insights when engaging with prospects:",
        swot: DUMMY_SWOT,
      };
    } else if (isBattleCard) {
      pendingAgentMessageRef.current = {
        role: "agent",
        text: "Here's your battle card for sales conversations:",
        battleCard: DUMMY_BATTLE_CARD,
      };
    } else {
      pendingAgentMessageRef.current = null;
    }

    setMessages((prev) => [...prev, { role: "user", text }]);
    setMessageInput("");
    setIsGenerating(true);

    setTimeout(() => {
      const agentMsg = pendingAgentMessageRef.current;
      pendingAgentMessageRef.current = null;
      if (agentMsg) {
        setMessages((prev) => [...prev, agentMsg]);
      }
      setIsGenerating(false);
    }, 800);
  };

  const handleExampleClick = (question: string) => {
    setMessageInput(question);
  };

  function handleQuickActionSwot() {
    if (!quickActionsEnabled || isGenerating) return;
    setMessageInput(SWOT_QUESTION);
    pendingAgentMessageRef.current = {
      role: "agent",
      text: "Here's your sales positioning SWOT analysis - use these insights when engaging with prospects:",
      swot: DUMMY_SWOT,
    };
    setMessages((prev) => [...prev, { role: "user", text: SWOT_QUESTION }]);
    setIsGenerating(true);
    setTimeout(() => {
      const agentMsg = pendingAgentMessageRef.current;
      pendingAgentMessageRef.current = null;
      if (agentMsg) setMessages((prev) => [...prev, agentMsg]);
      setIsGenerating(false);
      setMessageInput("");
    }, 800);
  }

  function handleQuickActionBattleCard() {
    if (!quickActionsEnabled || isGenerating) return;
    setMessageInput(BATTLE_CARD_QUESTION);
    pendingAgentMessageRef.current = {
      role: "agent",
      text: "Here's your battle card for sales conversations:",
      battleCard: DUMMY_BATTLE_CARD,
    };
    setMessages((prev) => [...prev, { role: "user", text: BATTLE_CARD_QUESTION }]);
    setIsGenerating(true);
    setTimeout(() => {
      const agentMsg = pendingAgentMessageRef.current;
      pendingAgentMessageRef.current = null;
      if (agentMsg) setMessages((prev) => [...prev, agentMsg]);
      setIsGenerating(false);
      setMessageInput("");
    }, 800);
  }

  function handleQuickAction(key: string) {
    if (key === "swot") handleQuickActionSwot();
    else if (key === "battlecard") handleQuickActionBattleCard();
    else if (key === "reports")
      setMessageInput("View sales reports and briefs");
  }

  return (
    <div className="sec_user_page org_settings_page sales_enablement_page">
      <div className="heading_user_page page_header_align">
        <div className="headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <BotIcon size={24} className="header_icon_svg" />
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Sales Enablement Agent</h1>
            <p className="sub_title page_header_subtitle">
              AI-powered sales assistance with SWOT analysis, battle cards, and
              Q&A.
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
            <div className="sales_enablement_chat_header">
              <div className="chat_message_header">
                <span className="chat_message_icon">
                  <BotIcon size={18} />
                </span>
                <div>
                  <span className="chat_message_title">AI Sales Assistant</span>
                  <p className="chat_message_subtitle">
                    Powered by vendor attestations & risk data.
                  </p>
                </div>
              </div>
            </div>
            <div className="sales_enablement_messages">
              <div className="chat_message chat_message--agent">
                <div className="bot_answer_sec sales_enablement_greeting_sec">
                  <span className="chat_message_icon"><BotIcon size={18} /></span>
                  <p>{GREETING}</p>
                </div>
              </div>
              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  role={msg.role}
                  icon={msg.role === "user" ? <User size={20} /> : undefined}
                >
                  {msg.role === "agent" && msg.swot ? (
                    <>
                      <div className="sales_enablement_agent_answer_wrap">
                        <span className="chat_message_icon sales_enablement_agent_icon">
                          <BotIcon size={18} />
                        </span>
                        <div className="bot_answer_sec">
                          {msg.text && (
                            <p className="sales_enablement_agent_intro">
                              {msg.text}
                            </p>
                          )}
                          <div className="sales_enablement_swot">
                            <div className="sales_enablement_swot_block sales_enablement_swot--strengths">
                              <div className="sales_enablement_swot_title">
                                <span>
                                  <TrendingUp className="swot_title_icons" />
                                </span>
                                <span>Strengths</span>
                              </div>
                              <ul>
                                {msg.swot.strengths.map((s, j) => (
                                  <li key={j}>{s}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="sales_enablement_swot_block sales_enablement_swot--weaknesses">
                              <div className="sales_enablement_swot_title">
                                <span><TrendingDown className="swot_title_icons"/></span>
                                <span>Weaknesses</span>
                              </div>
                              <ul>
                                {msg.swot.weaknesses.map((s, j) => (
                                  <li key={j}>{s}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="sales_enablement_swot_block sales_enablement_swot--opportunities">
                              <div className="sales_enablement_swot_title">
                                <span>
                                  <Lightbulb className="swot_title_icons" />
                                </span>
                                <span>Opportunities</span>
                              </div>
                              <ul>
                                {msg.swot.opportunities.map((s, j) => (
                                  <li key={j}>{s}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="sales_enablement_swot_block sales_enablement_swot--threats">
                              <div className="sales_enablement_swot_title">
                                <span>
                                  <TriangleAlert className="swot_title_icons" />
                                 
                                </span>
                                Threats
                              </div>
                              <ul>
                                {msg.swot.threats.map((s, j) => (
                                  <li key={j}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : msg.role === "agent" && msg.battleCard ? (
                    <div className="sales_enablement_agent_answer_wrap">
                      <span className="chat_message_icon sales_enablement_agent_icon">
                        <BotIcon size={18} />
                      </span>
                      <div className="bot_answer_sec">
                        {msg.text && (
                          <p className="sales_enablement_agent_intro">
                            {msg.text}
                          </p>
                        )}
                        <div className="sales_enablement_battle_card">
                          <h4 className="sales_enablement_battle_card_title">
                            {msg.battleCard.title}
                          </h4>
                          {(msg.battleCard.keyDifferentiators != null ||
                            msg.battleCard.complianceHighlights != null ||
                            msg.battleCard.objectionHandling != null) && (
                            <div className="sales_enablement_battle_card_grid">
                              {msg.battleCard.keyDifferentiators != null &&
                                msg.battleCard.keyDifferentiators.length > 0 && (
                                  <div className="sales_enablement_battle_card_section sales_enablement_battle_card--differentiators">
                                    <div className="sales_enablement_battle_card_section_header">
                                      <Target
                                        className="sales_enablement_battle_card_section_icon sales_enablement_battle_card_icon--blue"
                                        size={18}
                                        aria-hidden
                                      />
                                      <span>Key Differentiators</span>
                                    </div>
                                    <ul>
                                      {msg.battleCard.keyDifferentiators.map(
                                        (b, j) => (
                                          <li key={j}>{b}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              {msg.battleCard.complianceHighlights != null &&
                                msg.battleCard.complianceHighlights.length >
                                  0 && (
                                  <div className="sales_enablement_battle_card_section sales_enablement_battle_card--compliance">
                                    <div className="sales_enablement_battle_card_section_header">
                                      <FileCheck
                                        className="sales_enablement_battle_card_section_icon sales_enablement_battle_card_icon--green"
                                        size={18}
                                        aria-hidden
                                      />
                                      <span>Compliance Highlights</span>
                                    </div>
                                    <ul className="sales_enablement_battle_card_highlights">
                                      {msg.battleCard.complianceHighlights.map(
                                        (b, j) => (
                                          <li key={j}>{b}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              {msg.battleCard.objectionHandling != null && (
                                <div className="sales_enablement_battle_card_section sales_enablement_battle_card--objection">
                                  <div className="sales_enablement_battle_card_section_header">
                                    <Square
                                      className="sales_enablement_battle_card_section_icon sales_enablement_battle_card_icon--orange"
                                      size={18}
                                      aria-hidden
                                    />
                                    <span>Objection Handling</span>
                                  </div>
                                  <div className="sales_enablement_battle_card_qa">
                                    <p className="sales_enablement_battle_card_q">
                                      Q:{" "}
                                      {
                                        msg.battleCard.objectionHandling
                                          .question
                                      }
                                    </p>
                                    <p className="sales_enablement_battle_card_a">
                                      A:{" "}
                                      {
                                        msg.battleCard.objectionHandling
                                          .answer
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {msg.battleCard.qaBlocks != null &&
                            msg.battleCard.qaBlocks.length > 0 && (
                              <div className="sales_enablement_battle_card_qa_blocks">
                                {msg.battleCard.qaBlocks.map((qa, j) => (
                                  <div
                                    key={j}
                                    className="sales_enablement_battle_card_qa_card"
                                  >
                                    <p className="sales_enablement_battle_card_q">
                                      Q: {qa.question}
                                    </p>
                                    <p className="sales_enablement_battle_card_a">
                                      A: {qa.answer}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          {msg.battleCard.idealCustomerProfile != null && (
                            <div className="sales_enablement_battle_card_icp">
                              <h5 className="sales_enablement_battle_card_icp_title">
                                Ideal Customer Profile
                              </h5>
                              <p>
                                {msg.battleCard.idealCustomerProfile}
                              </p>
                            </div>
                          )}
                          {msg.battleCard.bullets != null &&
                            msg.battleCard.bullets.length > 0 && (
                              <ul>
                                {msg.battleCard.bullets.map((b, j) => (
                                  <li key={j}>{b}</li>
                                ))}
                              </ul>
                            )}
                        </div>
                      </div>
                    </div>
                  ) : msg.role === "agent" ? (
                    <div className="sales_enablement_agent_answer_wrap">
                      <span className="chat_message_icon sales_enablement_agent_icon">
                        <BotIcon size={18} />
                      </span>
                      <div className="bot_answer_sec">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </ChatMessage>
              ))}
              {isGenerating && (
                <div className="sales_enablement_loader_wrap">
                  <span className="chat_message_icon sales_enablement_agent_icon">
                    <BotIcon size={18} />
                  </span>
                  <Loader2 size={20} className="sales_enablement_loader_icon" aria-hidden />
                </div>
              )}
            </div>
            <div className="sales_enablement_input_row">
              <Input
                id="sales_enablement_message"
                labelName=""
                name="message"
                type="textarea"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                required={false}
                rows={3}
                placeholder="Ask how to address buyer concerns, handle objections, or position your solution..."
              />
              <Button
                type="button"
                className="sales_enablement_send_btn"
                onClick={handleSend}
                disabled={isGenerating || !selectedAssessmentId}
              >
                {isGenerating ? (
                  <Loader2 size={20} className="sales_enablement_send_loader" aria-hidden />
                ) : (
                  <Send size={20} aria-hidden />
                )}
              </Button>
            </div>
            <div className="sales_enablement_chat_actions">
              <button
                type="button"
                className="sales_enablement_chat_action_btn"
                disabled={!quickActionsEnabled}
                onClick={handleQuickActionSwot}
              >
                <BarChart3 size={16} aria-hidden />
                SWOT Analysis
              </button>
              <button
                type="button"
                className="sales_enablement_chat_action_btn"
                disabled={!quickActionsEnabled}
                onClick={handleQuickActionBattleCard}
              >
                <Swords size={16} aria-hidden />
                Battle Card
              </button>
            </div>
          </div>

          <aside className="sales_enablement_sidebar">
            <div className="sales_enablement_sidebar_card">
              <h3 className="sales_enablement_sidebar_title">Quick Actions</h3>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isDisabled =
                  ((action.key === "swot" || action.key === "battlecard") &&
                    !quickActionsEnabled) ||
                  isGenerating;
                return (
                  <Button
                    key={action.label}
                    type="button"
                    className="sales_enablement_quick_action_btn"
                    disabled={isDisabled}
                    onClick={() => handleQuickAction(action.key)}
                  >
                    <Icon size={18} aria-hidden />
                    {action.label}
                  </Button>
                );
              })}
            </div>
            <div className="sales_enablement_sidebar_card">
              <h3 className="sales_enablement_sidebar_title">
                Example Questions
              </h3>
              <ul className="sales_enablement_example_list">
                {EXAMPLE_QUESTIONS.map((q, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className="sales_enablement_example_btn"
                      onClick={() => handleExampleClick(q)}
                    >
                      <MessageSquare size={16} aria-hidden />
                      <ClickTooltip content={q} showOn="hover" position="top">
                        <span className="sales_enablement_example_btn_text">
                          {q}
                        </span>
                      </ClickTooltip>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MessageCircle, X, Send, CheckCircle2 } from "lucide-react";
import { useAdminData } from "@/lib/admin-store";

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);
  const { addInquiry } = useAdminData();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !phone.trim() || !email.trim()) return;

    // 1. Record inquiry directly in Admin Console Inquiries & Leads
    addInquiry({
      name: name.trim() || "Website Visitor",
      phone: phone.trim(),
      email: email.trim(),
      service: "General Inquiry",
      message: message.trim(),
    });

    // 2. Guaranteed Native HTML Form Submit via hidden iframe (Bypasses CORS & AdBlockers)
    try {
      let iframe = document.getElementById("chat_submit_iframe") as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "chat_submit_iframe";
        iframe.name = "chat_submit_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      }

      const form = document.createElement("form");
      form.action = "https://formsubmit.co/visezworks@gmail.com";
      form.method = "POST";
      form.target = "chat_submit_iframe";

      const payload: Record<string, string> = {
        name: name.trim() || "Website Visitor",
        phone: phone.trim(),
        email: email.trim(),
        service: "General Inquiry",
        message: message.trim(),
        _subject: `NEW CHAT LEAD: ${name.trim() || "Visitor"} (${phone.trim()})`,
        _captcha: "false",
        _template: "table",
      };

      for (const [k, v] of Object.entries(payload)) {
        const inp = document.createElement("input");
        inp.type = "hidden";
        inp.name = k;
        inp.value = v;
        form.appendChild(inp);
      }

      document.body.appendChild(form);
      form.submit();
      setTimeout(() => {
        if (form.parentNode) form.parentNode.removeChild(form);
      }, 1000);
    } catch (err) {
      console.warn("FormSubmit background dispatch error:", err);
    }

    setSentSuccess(true);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 16, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="glass-panel absolute bottom-14 left-0 w-[320px] rounded-3xl border border-border p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] bg-card/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                </span>
                <p className="font-bebas text-sm uppercase tracking-wider text-foreground">
                  Direct Studio Message
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-muted-foreground transition-colors hover:text-foreground p-1 rounded hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            </div>

            {sentSuccess ? (
              <div className="py-6 px-3 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-7 text-emerald-500" />
                </div>
                <h4 className="font-bebas text-xl uppercase tracking-wider text-foreground">
                  Inquiry Received!
                </h4>
                <p className="text-xs text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                  Thank you! Your project inquiry has been recorded and sent directly to our studio team at <strong className="text-foreground">visezworks@gmail.com</strong>.
                </p>
                <button
                  onClick={() => {
                    setName("");
                    setPhone("");
                    setEmail("");
                    setMessage("");
                    setSentSuccess(false);
                    setOpen(false);
                  }}
                  className="w-full rounded-xl bg-primary py-2.5 font-bebas text-xs uppercase text-primary-foreground hover:opacity-90 tracking-wider shadow-sm"
                >
                  OK, Close
                </button>
              </div>
            ) : (
              <div>
                <p className="text-[12.5px] text-muted-foreground mb-3 leading-snug">
                  Send a quick message directly to our studio admins:
                </p>

                <form onSubmit={handleSend} className="space-y-2 text-left">
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name (Optional)"
                      className="w-full rounded-xl border border-input bg-background/80 px-3 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address *"
                      className="w-full rounded-xl border border-input bg-background/80 px-3 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone / WhatsApp Number *"
                      className="w-full rounded-xl border border-input bg-background/80 px-3 py-1.5 text-xs font-mono text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project..."
                      className="w-full rounded-xl border border-input bg-background/80 px-3 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary py-2.5 font-bebas text-xs sm:text-sm uppercase text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm tracking-wider"
                  >
                    <Send className="size-3.5" /> Submit Inquiry
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open direct studio chat"
        className="relative grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_rgba(255,85,0,0.6)] border border-primary/40"
      >
        <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
        <MessageCircle className="size-5" />
      </motion.button>
    </div>
  );
}

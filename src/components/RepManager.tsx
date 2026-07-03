"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, Input, Fab, Button, View, Text, EmptyState, Timeline, TimelineItem, TimelineCard, TimelineDate, TimelineTitle, TimelineActions, OptionPicker, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@amazecontinuityprojects/amazeui";
import { apiFetch } from "@/lib/api";
import { Plus, Trash2, Loader2, UserPlus, Shield, User, CheckCircle2, XCircle } from "lucide-react";

interface Rep {
  id: number;
  vtop_id: string;
  role: string;
  created_at: string;
}

export default function RepManager({ clubId }: { clubId: string }) {
  const [reps, setReps] = useState<Rep[]>([]);
  const [newRep, setNewRep] = useState("");
  const [newRole, setNewRole] = useState("representative");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchReps = async () => {
      try {
        const res = await apiFetch(`/api/club-admin/reps?club_id=${encodeURIComponent(clubId)}`);
        const data = await res.json();
        if (data.success) setReps(data.reps || []);
      } catch (err) { console.error("Failed to load reps"); }
      finally { setLoading(false); }
    };
    fetchReps();
  }, [clubId]);

  const handleAdd = async () => {
    if (!newRep.trim()) return;
    setAdding(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await apiFetch("/api/club-admin/reps", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ club_id: clubId, vtop_id: newRep.trim(), role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setReps(prev => [...prev, { id: Date.now(), vtop_id: newRep.trim(), role: newRole, created_at: new Date().toISOString() }]);
        setNewRep("");
        setNewRole("representative");
        setShowForm(false);
        setMessage({ type: "success", text: "Representative added" });
      } else setMessage({ type: "error", text: data.error || "Failed to add rep" });
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally {
      setAdding(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    }
  };

  const handleDelete = async (vtop_id: string) => {
    setMessage({ type: "", text: "" });
    try {
      const res = await apiFetch(`/api/club-admin/reps?vtop_id=${encodeURIComponent(vtop_id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReps(prev => prev.filter(r => r.vtop_id !== vtop_id));
        setMessage({ type: "success", text: "Representative removed" });
      } else setMessage({ type: "error", text: data.error || "Failed to remove rep" });
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally {
      setDeleting(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Added today";
    if (days === 1) return "Added yesterday";
    if (days < 7) return `Added ${days} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return <View className="flex-1 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-info" /></View>;
  }

  return (
    <View className="flex flex-col w-full h-full space-y-0">
      <View className="flex flex-row items-center justify-between mb-6 shrink-0">
        <View className="flex flex-row items-center gap-3">
          <Text className="text-2xl font-bold tracking-tight text-foreground">Representatives</Text>
          <View className="bg-muted/80 rounded-full px-3 py-1">
            <Text className="text-xs font-semibold text-muted-foreground">{reps.length} rep{reps.length !== 1 ? "s" : ""}</Text>
          </View>
        </View>
        <Button onClick={() => setShowForm(!showForm)} variant="default" size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Rep
        </Button>
      </View>

      {showForm && (
        <Card className="mb-6 shrink-0 border-info/30 bg-info-surface/5 animate-enter">
          <CardContent className="p-4 space-y-3">
            <View className="flex flex-col sm:flex-row gap-3">
              <Input name="vtop_id" value={newRep}
                onChange={(e: any) => setNewRep(e.target.value)}
                placeholder="Registration Number" className="flex-1"
                onKeyDown={(e: any) => e.key === "Enter" && handleAdd()} />
              <OptionPicker
                value={newRole}
                onChange={setNewRole}
                options={[
                  { value: "representative", label: "Representative" },
                  { value: "super-club-rep", label: "Super Rep" }
                ]}
                className="sm:w-40"
              />
              <Button onClick={handleAdd} disabled={adding || !newRep.trim()} variant="default" className="sm:w-auto">
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Add
              </Button>
              <Button onClick={() => { setShowForm(false); setNewRep(""); setNewRole("representative"); }} variant="ghost" className="sm:w-auto">Cancel</Button>
            </View>
          </CardContent>
        </Card>
      )}

      <View className="flex-1">
        {reps.length === 0 ? (
          <View className="flex items-center justify-center pt-12">
            <EmptyState icon={<Shield className="w-8 h-8" />}
              title="No representatives"
              description="Add registration numbers to grant admin access">
              <Button variant="secondary" onClick={() => setShowForm(true)} className="mt-2">
                <Plus className="w-4 h-4" /> Add First Rep
              </Button>
            </EmptyState>
          </View>
        ) : (
          <Timeline className="w-full max-w-2xl">
            {reps.map((rep, i) => (
              <TimelineItem key={rep.vtop_id} dotColor={i % 2 === 0 ? "indigo" : "purple"}>
                <TimelineCard>
                  <View className="flex flex-row items-start justify-between gap-2">
                    <View className="flex flex-row items-center gap-3 min-w-0">
                      <View className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex flex-row items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-indigo-500" />
                      </View>
                      <View className="min-w-0">
                        <View className="flex flex-row items-center gap-2">
                          <TimelineTitle>{rep.vtop_id}</TimelineTitle>
                          {rep.role === "super-club-rep" && (
                            <View className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-full px-2 py-0.5">
                              <Text className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Super</Text>
                            </View>
                          )}
                        </View>
                        <TimelineDate>{formatDate(rep.created_at)}</TimelineDate>
                      </View>
                    </View>
                    <Button variant="ghost" size="icon"
                      onClick={() => setDeleting(rep.vtop_id)}
                      className="text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2 h-7 w-7 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </View>
                </TimelineCard>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </View>

      {message.text && (
        <View className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <View className={`flex flex-row items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-xl ${
            message.type === "success"
              ? "bg-success-surface/90 border-success/30 text-success-foreground"
              : "bg-danger-surface/90 border-danger/30 text-danger"
          }`}>
            {message.type === "success"
              ? <CheckCircle2 className="w-4 h-4 shrink-0" />
              : <XCircle className="w-4 h-4 shrink-0" />
            }
            <Text className="text-sm font-medium">{message.text}</Text>
          </View>
        </View>
      )}

      <Fab
        icon={<UserPlus className="w-5 h-5" />}
        label="Add Rep"
        onPress={() => setShowForm(!showForm)}
        position="bottom-right"
        variant="primary"
      />

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Representative</DialogTitle>
            <DialogDescription>Remove {deleting} from the rep list? They will lose admin access.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleting && handleDelete(deleting)}>
              <Trash2 className="w-4 h-4" /> Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}

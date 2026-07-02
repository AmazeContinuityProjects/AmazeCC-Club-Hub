"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, Input, Label, Button, Select, View, Text } from "@amazecontinuityprojects/amazeui";
import { apiFetch } from "@/lib/api";
import { Trash2, UserPlus, Shield, User, Users, Loader2 } from "lucide-react";

export default function RepManager({ clubId }: { clubId: string }) {
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVtopId, setNewVtopId] = useState("");
  const [newRole, setNewRole] = useState("representative");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchReps = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/club-admin/reps?club_id=${encodeURIComponent(clubId)}`);
      const data = await res.json();
      if (data.success) setReps(data.reps || []);
    } catch (err: any) { setError(err.message || "Failed to load reps"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReps(); }, [clubId]);

  const handleAddRep = async () => {
    if (!newVtopId.trim()) return;
    setAdding(true); setError("");
    try {
      const res = await apiFetch('/api/club-admin/reps', {
        method: "POST", body: JSON.stringify({ vtop_id: newVtopId.trim(), role: newRole }),
      });
      const data = await res.json();
      if (data.success) { setNewVtopId(""); setNewRole("representative"); fetchReps(); }
      else setError(data.error || "Failed to add rep");
    } catch (err: any) { setError(err.message || "An error occurred"); }
    finally { setAdding(false); }
  };

  const handleRemoveRep = async (vtop_id: string) => {
    if (!confirm(`Are you sure you want to remove ${vtop_id}?`)) return;
    try {
      const res = await apiFetch(`/api/club-admin/reps?vtop_id=${encodeURIComponent(vtop_id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchReps(); else setError(data.error || "Failed to remove rep");
    } catch (err: any) { setError(err.message || "An error occurred"); }
  };

  return (
    <View className="space-y-8 max-w-4xl mx-auto pb-24">
      <Card className="relative overflow-hidden">
        <View className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <UserPlus className="w-32 h-32" />
        </View>
        <CardHeader>
          <View className="flex flex-row items-center gap-3 relative z-10">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <CardTitle>Add Representative</CardTitle>
          </View>
        </CardHeader>
        <CardContent>
          <View className="flex flex-col sm:flex-row gap-4 relative z-10">
            <View className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1.5 ml-1">VTOP Registration Number</Label>
              <Input placeholder="e.g. 21BCE0000" className="font-mono uppercase" value={newVtopId} onChange={(e: any) =>  setNewVtopId(e.target.value)} />
            </View>
            <View className="sm:w-48">
              <Label className="text-xs text-muted-foreground mb-1.5 ml-1">Access Level</Label>
              <Select value={newRole} onChange={setNewRole} options={[
                { value: "representative", label: "Representative" },
                { value: "super-club-rep", label: "Super Rep" },
              ]} />
            </View>
            <View className="flex flex-row items-end">
              <Button onClick={handleAddRep} disabled={adding || !newVtopId.trim()} variant="default">
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Grant Access"}
              </Button>
            </View>
          </View>
          {error && (
            <View className="mt-4 p-3 bg-danger-surface border border-danger/30 rounded-xl relative z-10">
              <Text className="text-danger text-sm font-medium">{error}</Text>
            </View>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
          <View className="flex flex-row items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <CardTitle>Current Representatives</CardTitle>
          </View>
          <Text className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
            {reps.length} Total
          </Text>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <View className="p-12 flex flex-row justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600/50" /></View>
          ) : reps.length === 0 ? (
            <View className="p-12 text-center flex flex-col items-center justify-center">
              <View className="w-16 h-16 bg-muted rounded-full flex flex-row items-center justify-center mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </View>
              <Text className="text-muted-foreground font-medium">No representatives found.</Text>
              <Text className="text-muted-foreground/70 text-sm mt-1">Add someone above to grant them access to this club.</Text>
            </View>
          ) : (
            <View className="divide-y divide-border">
              {reps.map((rep) => (
                <View key={rep.id} className="p-5 sm:px-8 flex flex-row items-center justify-between hover:bg-muted/30 transition-colors group">
                  <View className="flex flex-row items-center gap-4">
                    <View className={`w-12 h-12 rounded-full flex flex-row items-center justify-center ${rep.role === 'super-club-rep' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                      {rep.role === 'super-club-rep' ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
                    </View>
                    <View>
                      <Text className="font-bold text-foreground text-lg font-mono">{rep.vtop_id}</Text>
                      <View className="flex flex-row items-center gap-1.5 mt-1">
                        {rep.role === 'super-club-rep' ? (
                          <Text className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider text-[10px] bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/50">
                            Super Representative
                          </Text>
                        ) : (
                          <Text className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-[10px] bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/50">
                            Representative
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <Button onClick={() => handleRemoveRep(rep.vtop_id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-danger hover:bg-danger-surface rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" title="Remove Representative">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
}


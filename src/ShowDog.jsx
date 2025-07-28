import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import supabase from "./services/supabase";

function ShowDog() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let { data, error } = await supabase
        .from("Godfather Kennel")
        .select("*")
        .eq("unique_id", id)
        .single();

      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="shadow-xl border border-muted">
        <CardHeader>
  <h2 className="text-2xl font-bold text-center mb-1">Verify Dog Certificate</h2>
  <p className="text-muted-foreground text-sm text-center">
    Enter the Unique ID printed on the certificate to fetch your registered dog's details.
  </p>
</CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="id" className="mb-2">Certificate Unique ID</Label>
              <Input
                name="id"
                placeholder="e.g., 34576712"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
              ) : (
                "Search Dog"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ShowDog;

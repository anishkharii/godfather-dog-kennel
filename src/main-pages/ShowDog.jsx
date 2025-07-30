import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

function ShowDog() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setId(e.target.value);
    setError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setError("Id is Required");
      return;
    }
    if(id.length<8 || id.length>8){
      setError("Certificate ID must be exactly 8 digits long");
      return;
    }
    try {
      setLoading(true);
      let { data, error } = await supabase
        .from("Godfather Kennel")
        .select("*")
        .eq("unique_id", id)
        .single();
      if(error){
        throw error;
      }
      console.log(data);
      navigate(`/dog/${id}`);

    } catch (err) {
      console.error(err);
      setError("Dog not found. Please check the ID.");
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
                type='number'
                placeholder="e.g., 34576712"
                value={id}
                autoComplete="off"
                onChange={handleChange}
              />
              {
                error &&
                <Label className="mt-2 font-light text-red-600">{error}</Label>
              }
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
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

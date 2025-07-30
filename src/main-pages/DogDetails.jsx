import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { LoaderCircle, Maximize, X } from "lucide-react";
import supabase from "../services/supabase";

function DogDetails() {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchDog = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Godfather Kennel")
          .select("*")
          .eq("unique_id", id)
          .single();

        if (error) throw error;
        setDog(data);
        console.log(data);
      } catch (err) {
        console.error(err);
        setError("Dog not found. Please check the ID.");
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="shadow-xl border border-muted rounded-xl p-6 animate-pulse space-y-6">
          <div className="w-full h-60 bg-muted rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-6 bg-muted rounded" />
            <div className="h-6 bg-muted rounded" />
            <div className="h-6 bg-muted rounded" />
            <div className="h-6 bg-muted rounded" />
            <div className="md:col-span-2 h-16 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="text-center text-red-600 font-medium mt-10">
        {error || "No data found."}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="shadow-xl border border-muted">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center mb-1">
            Dog Certificate Details
          </h2>
          <p className="text-muted-foreground text-sm text-center">
            Details for Certificate ID:{" "}
            <span className="font-semibold">{id}</span>
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div
            className="w-full max-h-80 flex justify-center items-center bg-white rounded-xl border overflow-hidden p-2 relative group cursor-pointer"
            onClick={() => setShowPreview(true)}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex justify-center items-center bg-white/50 z-10">
                <LoaderCircle className="animate-spin h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <img
              src={dog.image_url}
              alt="Dog Certificate"
              onLoad={() => setImageLoaded(true)}
              className={`max-h-72 w-full object-contain transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-md  transition"
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
            >
              <Maximize className="w-4 h-4" />
            </div>
          </div>

         
          {showPreview && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-4"
              onClick={() => setShowPreview(false)}
            >
              <div className="relative max-w-5xl w-full">
                <img
                  src={dog.image_url}
                  alt="Dog Certificate Fullscreen"
                  className="w-full max-h-screen object-contain rounded-md shadow-lg"
                />
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Breed", value: dog.breed },
              {
                label: "Date of Adoption",
                value: new Date(dog.created_at).toDateString(),
              },
              { label: "Owner", value: dog.owner },
              {
                label: "Date of Birth",
                value: new Date(dog.date_of_birth).toDateString(),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-muted/30 rounded-lg px-4 py-3 border border-muted shadow-sm hover:shadow-md transition"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                  {item.label}
                </p>
                <p className="text-base font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}

            {dog.notes && (
              <div className="md:col-span-2 bg-muted/30 rounded-lg px-4 py-3 border border-muted shadow-sm hover:shadow-md transition">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                  Notes
                </p>
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {dog.notes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DogDetails;

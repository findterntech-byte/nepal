import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Star } from "lucide-react";
import { Link } from "wouter";

interface TuitionListingCardProps {
  listing: any;
}

export function TuitionListingCard({ listing }: TuitionListingCardProps) {
  const subjects = listing.subjectsOffered || [];
  const feeLabel = listing.feePerHour ? `${listing.feePerHour} / hr` : listing.feePerMonth ? `${listing.feePerMonth} / mo` : listing.feePerSubject ? `${listing.feePerSubject} / subject` : '—';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{listing.title || listing.tutorName || 'Tuition Class'}</h3>
            <div className="text-sm text-muted-foreground mt-1">Tutor: <span className="font-medium text-foreground">{listing.tutorName}</span></div>
            {listing.tutorQualification && (
              <div className="text-sm text-muted-foreground">{listing.tutorQualification}{listing.tutorExperienceYears ? ` · ${listing.tutorExperienceYears} yrs` : ''}</div>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-700 font-semibold">{feeLabel}</div>
            {listing.isFeatured && <Badge className="mt-2">Featured</Badge>}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground line-clamp-3">{listing.description}</p>

        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground">
          {subjects.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{subjects.length} subjects</Badge>
              <div className="truncate">{subjects.slice(0,4).join(', ')}{subjects.length > 4 ? '…' : ''}</div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {listing.city && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{listing.city}{listing.areaName ? `, ${listing.areaName}` : ''}</span>
              </div>
            )}

            {listing.rating && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{listing.rating}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex gap-3">
        {listing.contactPhone ? (
          <a href={`tel:${listing.contactPhone}`} className="flex-1">
            <Button variant="outline" className="w-full justify-center gap-2"><Phone className="w-4 h-4" /> Call</Button>
          </a>
        ) : (
          <Button variant="outline" className="flex-1">Call</Button>
        )}

        <Link href={`/tuition-private-classes/${listing.id}`} className="flex-1">
          <Button className="w-full">Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default TuitionListingCard;

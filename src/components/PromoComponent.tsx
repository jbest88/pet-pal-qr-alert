
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, glass } from "@/lib/utils";

interface PromoComponentProps {
  title: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
  className?: string;
  variant?: 'default' | 'featured' | 'subtle';
  icon?: React.ReactNode;
}

export default function PromoComponent({
  title,
  description,
  linkText = "Learn More",
  linkUrl = "#",
  className,
  variant = 'default',
  icon = <Star className="h-5 w-5" />
}: PromoComponentProps) {
  const variants = {
    default: "bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/10",
    featured: "bg-gradient-to-br from-primary/30 to-secondary/20 border border-primary/30 shadow-lg",
    subtle: `${glass} border-white/20`
  };
  
  return (
    <Card className={cn(variants[variant], "overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1.5 text-primary">
            {icon}
          </div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
      {linkUrl && (
        <CardFooter className="pt-2">
          <Button variant="link" className="px-0 py-0 h-auto" asChild>
            <Link to={linkUrl} className="inline-flex items-center gap-1 text-primary">
              {linkText} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

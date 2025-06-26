
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "UnionTrust Capital has been instrumental in growing my business. Their business banking solutions and personal service are unmatched.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content: "The mobile app is incredibly intuitive and secure. I can manage all my finances on the go without any hassle.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      content: "Their investment advisory services helped me plan for retirement effectively. The team is knowledgeable and trustworthy.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-banking-navy mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-banking-slate max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust UnionTrust Capital with their financial future.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-banking-gold text-xl">★</span>
                  ))}
                </div>
                <blockquote className="text-banking-slate italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="border-t pt-4">
                  <p className="font-semibold text-banking-navy">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-banking-slate">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

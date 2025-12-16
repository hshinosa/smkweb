import React from 'react';
import { 
    AcademicLayout, 
    AcademicHero, 
    ContentSection, 
    FeatureCard,
    StatisticsGrid,
    TestimonialCard,
    CallToAction 
} from '@/Components/Academic';
import { BookOpen, Users, Award, Lightbulb } from 'lucide-react';

/**
 * Example Academic Page demonstrating consistent component usage
 * This serves as a template for creating new academic pages
 */
export default function AcademicPageExample() {
    // Example data - in real pages, this would come from centralized data files
    const features = [
        {
            icon: BookOpen,
            title: "Comprehensive Curriculum",
            subtitle: "Modern Learning",
            description: "Our curriculum is designed to meet international standards while maintaining local cultural values.",
            details: ["Interactive Learning", "Project-Based Approach", "Digital Integration"]
        },
        {
            icon: Users,
            title: "Expert Faculty",
            subtitle: "Qualified Teachers",
            description: "Our teachers are highly qualified professionals with years of experience in education.",
            details: ["Master's Degree Holders", "Continuous Training", "Industry Experience"]
        },
        {
            icon: Award,
            title: "Achievement Record",
            subtitle: "Proven Success",
            description: "Our students consistently achieve excellent results in national and international competitions.",
            details: ["National Awards", "International Recognition", "University Acceptance"]
        },
        {
            icon: Lightbulb,
            title: "Innovation Focus",
            subtitle: "Future Ready",
            description: "We prepare students for the future with innovative teaching methods and technology integration.",
            details: ["STEM Programs", "Digital Literacy", "Critical Thinking"]
        }
    ];

    const statistics = [
        { value: "98%", label: "Graduate Success Rate" },
        { value: "150+", label: "University Partners" },
        { value: "50+", label: "Awards Won" },
        { value: "1000+", label: "Alumni Network" }
    ];

    const testimonials = [
        {
            name: "Ahmad Rizki Pratama",
            role: "Software Engineer at Tech Company",
            education: "Computer Science ITB → Tech Industry",
            testimonial: "The education I received here provided a strong foundation for my career in technology. The teachers were supportive and the curriculum was comprehensive.",
            initials: "AR"
        },
        {
            name: "Siti Nurhaliza",
            role: "Medical Doctor",
            education: "Medical Faculty UI → Specialist Doctor",
            testimonial: "The science program here prepared me well for medical school. The laboratory facilities and dedicated teachers made all the difference.",
            initials: "SN"
        }
    ];

    return (
        <AcademicLayout>
            <AcademicHero
                title="Academic Excellence"
                description="Discover our commitment to providing world-class education that prepares students for success in higher education and their future careers."
                pageTitle="Academic Excellence - SMAN 1 Baleendah"
                metaDescription="Learn about our academic programs, qualified faculty, and student achievements at SMAN 1 Baleendah."
            />

            <ContentSection 
                title="Excellence"
                subtitle="Our Commitment to"
                description="We strive to provide the best educational experience through innovative teaching methods and comprehensive support systems."
                backgroundColor="bg-secondary"
            >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            subtitle={feature.subtitle}
                            description={feature.description}
                            details={feature.details}
                        />
                    ))}
                </div>
            </ContentSection>

            <ContentSection 
                title="Achievements"
                subtitle="Our"
                description="Numbers that reflect our commitment to educational excellence and student success."
                backgroundColor="bg-white"
            >
                <StatisticsGrid
                    title="Key Performance Indicators"
                    statistics={statistics}
                />
            </ContentSection>

            <ContentSection 
                title="Stories"
                subtitle="Success"
                description="Hear from our alumni about their journey and achievements after graduating from SMAN 1 Baleendah."
                backgroundColor="bg-gray-50"
            >
                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            name={testimonial.name}
                            role={testimonial.role}
                            education={testimonial.education}
                            testimonial={testimonial.testimonial}
                            initials={testimonial.initials}
                        />
                    ))}
                </div>
            </ContentSection>

            <CallToAction
                title="Join Our Academic Community"
                description="Take the first step towards academic excellence. Learn more about our programs and admission process."
                primaryButton={{ text: "Apply Now", href: "/informasi-spmb" }}
                secondaryButton={{ text: "Learn More", href: "/profil-sekolah" }}
            />
        </AcademicLayout>
    );
}
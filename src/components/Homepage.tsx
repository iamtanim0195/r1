import Link from "next/link";
export default function Homepage() {
    const sections = [
        {
            title: "🎯 What is Ola Researcher?",
            text: "Ola Researcher is an innovative platform created to help master’s students easily discover and connect with professors who share their research interests—across top universities in California.",
            image: "https://wallpapercave.com/wp/wp2017236.jpg"
        },
        {
            title: "💡 Why Ola Researcher?",
            text: "Tired of browsing dozens of university websites and scattered professor profiles? Ola Researcher brings everything into one smart platform.",
            image: "https://wallpapercave.com/wp/wp2017289.jpg"
        },
        {
            title: "🚀 Key Features:",
            text: "Match by Research Interest, University Insights including language requirements, TOEFL scores, GRE status, Faculty Finder with scholar links, and Application-ready filters.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Royce_Hall_edit.jpg/1920px-Royce_Hall_edit.jpg"
        },
        {
            title: "🌎 Who Is It For?",
            text: "Final-year undergraduates or recent graduates aiming for a master's in California, students seeking early research connections, and anyone overwhelmed by scattered grad school info.",
            image: "https://media.istockphoto.com/id/1177581426/photo/csuf.jpg?s=612x612&w=0&k=20&c=hjPrsKPlb5yIegEhNL3B4ztj6Fm8ijpsUSCQlAykDLs="
        },
        {
            title: "📌 Make Smarter Decisions",
            text: "With Ola Researcher, you don’t just apply—you connect with purpose.",
            image: "https://media.istockphoto.com/id/1848487919/photo/california-polytechnic-state-university.jpg?s=612x612&w=0&k=20&c=vixg1sxD6Ap42rfFipXPKAh-9wl1ZykeDnvMwEMDrcU="
        }
    ];

    return (
        <main className="min-h-screen bg-gray-100 text-gray-800">
            {/* Hero Section */}
            <section className="text-center py-16 px-6 bg-gradient-to-b from-white to-gray-100">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Connect. Collaborate. Conquer.</h1>
                <p className="text-lg mb-6">Find Your Research Match. Shape Your Academic Future.</p>
                <Link href="/users">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">Start Exploring Now</button>
                </Link>
            </section>

            {/* Text & Image Sections */}
            {sections.map((section, i) => (
                <section key={i} className={`flex flex-col md:flex-row items-center gap-8 px-6 py-10 max-w-6xl mx-auto ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                        <p className="text-gray-700 text-lg">{section.text}</p>
                    </div>
                    <div className="flex-1">
                        <img src={section.image} alt={section.title} className="rounded shadow-md w-full h-64 object-cover" />
                    </div>
                </section>
            ))}

            {/* University Gallery */}
            <section className="px-6 py-10 bg-white">
                <h2 className="text-2xl font-semibold text-center mb-6">🏫 University Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {["https://media.istockphoto.com/id/1126586032/photo/ucla-campus.jpg?s=612x612&w=0&k=20&c=qW5jvHOjS3trwBy8Lax0QbPY4MQT1_HZl5271O7U9B8=",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI98M-IXOzwcT4Ye3z01kimqFrqmKwy4Qpaw&s",
                        "https://media.istockphoto.com/id/458544337/photo/california-state-university-northridge.jpg?s=612x612&w=0&k=20&c=Iu5jVads72-I1HV6_rm2rj216x2zNcytzCqvAnb5cmM="]
                        .map((url, i) => (
                            <div key={i} className="rounded overflow-hidden shadow-md">
                                <img src={url} alt={`University ${i}`} className="w-full h-48 object-cover" />
                            </div>
                        ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-6 text-sm text-gray-500">
                <p>© 2023 Ola Researcher. All rights reserved.</p>
            </footer>
        </main>
    );
}

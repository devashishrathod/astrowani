// require("dotenv").config();
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const Category = require("../models/categoryModel");
// const User = require("../models/userModel");
// const Astrologer = require("../models/astrologerModel");

// const MONGODB_URI =
//   process.env.MONGODB_URI ||
//   "mongodb+srv://ajmalshk:dGXU4fTxwIfm1lCV@cluster0.rqu0x8d.mongodb.net/Astrology";

// mongoose.connect(MONGODB_URI);

// const categories = [
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f397e"),
//     name: "Love & Relationship",
//     image: "path/to/love_relationship_image.jpg",
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3982"),
//     name: "Break-up & Divorce",
//     image: "path/to/breakup_divorce_image.jpg",
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3981"),
//     name: "Numerology",
//     image: "path/to/numerology_image.jpg",
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3983"),
//     name: "Marital Life",
//     image: "path/to/marital_life_image.jpg",
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3984"),
//     name: "Psychic Reading",
//     image: "path/to/psychic_reading_image.jpg",
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f397f"),
//     name: "Tarot Reading",
//     image: "path/to/tarot_reading_image.jpg",
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3980"),
//     name: "Career & Job",
//     image: "path/to/career_job_image.jpg",
//   },
// ];

// const users = [
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3985"),
//     email: "admin@example.com",
//     password: "12345678", // This will be hashed before insertion
//     role: "admin",
//     firstName: "Admin",
//     lastName: "User",
//     isVerified: true,
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3986"),
//     email: "customer@example.com",
//     password: "12345678", // This will be hashed before insertion
//     role: "customer",
//     firstName: "John",
//     lastName: "Doe",
//     isVerified: true,
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3987"),
//     email: "astrologer1@example.com",
//     password: "12345678", // This will be hashed before insertion
//     role: "astrologer",
//     firstName: "Jane",
//     lastName: "Smith",
//     isVerified: true,
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3988"),
//     email: "astrologer2@example.com",
//     password: "12345678", // This will be hashed before insertion
//     role: "astrologer",
//     firstName: "Mike",
//     lastName: "Johnson",
//     isVerified: true,
//   },
// ];

// const astrologers = [
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3989"),
//     name: "Jane Smith",
//     email: "astrologer1@example.com",
//     phoneNumber: "1234567890",
//     specialties: [
//       new mongoose.Types.ObjectId("64d84201618d5d18fb1f397e"),
//       new mongoose.Types.ObjectId("64d84201618d5d18fb1f397f"),
//     ],
//     experience: 10,
//     bio: "Jane has been practicing astrology for 10 years, specializing in love and relationships.",
//     profileImage: "path/to/jane_profile.jpg",
//     rating: 4.8,
//     isAvailable: true,
//     pricing: 50,
//     userId: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3987"),
//   },
//   {
//     _id: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3990"),
//     name: "Mike Johnson",
//     email: "astrologer2@example.com",
//     phoneNumber: "9876543210",
//     specialties: [
//       new mongoose.Types.ObjectId("64d84201618d5d18fb1f3981"),
//       new mongoose.Types.ObjectId("64d84201618d5d18fb1f3980"),
//     ],
//     experience: 15,
//     bio: "Mike is an expert in numerology and career guidance with 15 years of experience.",
//     profileImage: "path/to/mike_profile.jpg",
//     rating: 4.9,
//     isAvailable: true,
//     pricing: 60,
//     userId: new mongoose.Types.ObjectId("64d84201618d5d18fb1f3988"),
//   },
// ];

// async function seedDatabase() {
//   try {
//     await Category.deleteMany({});
//     await User.deleteMany({});
//     await Astrologer.deleteMany({});
//     // Check if data already exists
//     const existingCategories = await Category.countDocuments();
//     const existingUsers = await User.countDocuments();
//     const existingAstrologers = await Astrologer.countDocuments();

//     if (
//       existingCategories > 0 ||
//       existingUsers > 0 ||
//       existingAstrologers > 0
//     ) {
//       console.log("Data already exists. Skipping seeding.");
//       return;
//     }

//     // Seed categories
//     await Category.insertMany(categories);
//     console.log("Categories seeded successfully!");

//     // Hash passwords before seeding users
//     for (let user of users) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(user.password, salt);
//     }

//     // Seed users
//     // Note: We're not manually hashing passwords here as the UserSchema.pre('save') middleware will handle it
//     await User.insertMany(users);
//     console.log("Users seeded successfully!");

//     // Seed astrologers
//     await Astrologer.insertMany(astrologers);
//     console.log("Astrologers seeded successfully!");

//     console.log("Database seeded successfully!");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// seedDatabase();

// await Blog.deleteMany({});
// // Seed blogs
// const blogs = [
//   {
//     title: "The Power of Numerology: Unlocking the Secrets of Your Life Path",
//     slug: "the-power-of-numerology-unlocking-the-secrets-of-your-life-path",
//     thumbnail: "https://via.placeholder.com/150?text=Numerology",
//     content:
//       "<p>Numerology is an ancient practice that seeks to understand the hidden meanings behind numbers and their influence on our lives. By examining numbers associated with an individual, such as their birthdate or name, numerologists can reveal insights into their personality, life purpose, and future possibilities.</p><p>One of the core concepts in numerology is the Life Path Number, which is derived from your birthdate. This number provides insight into your fundamental traits and the life journey you are meant to follow. To calculate your Life Path Number, add together the digits of your birthdate until you arrive at a single digit. For example, if you were born on July 22, 1985, you would calculate your Life Path Number as follows:</p><p>7 (month) + 22 (day) + 1985 (year) = 2014</p><p>2 + 0 + 1 + 4 = 7</p><p>Your Life Path Number would be 7. Each number from 1 to 9, as well as the Master Numbers 11, 22, and 33, has its own unique significance and characteristics. For instance, a Life Path Number of 7 is associated with introspection, spirituality, and a quest for knowledge. People with this number are often deep thinkers and seekers of truth.</p><p>In addition to the Life Path Number, numerology also examines other numbers related to an individual’s name. The Expression Number, for example, is derived from the full name given at birth and represents one's natural talents and abilities. This number is calculated by assigning a numerical value to each letter in the name and then summing them up. Each letter corresponds to a number from 1 to 9:</p><p>A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9, S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8</p><p>By understanding the significance of these numbers, individuals can gain greater self-awareness and make more informed decisions about their lives. Numerology can offer valuable insights into personal challenges, relationships, career choices, and more.</p><p>It is important to remember that numerology is not a science but rather a tool for personal exploration. The insights gained from numerological analysis should be used as a guide rather than a definitive prediction of the future. Ultimately, the power to shape your destiny lies in your own hands.</p><p>For those interested in delving deeper into numerology, numerous resources are available, including books, courses, and professional numerologists. Exploring these resources can provide a deeper understanding of the principles of numerology and how they can be applied to your own life.</p><p>Whether you are a skeptic or a believer, numerology offers a fascinating lens through which to view the world and your place in it. By embracing the wisdom of numbers, you can unlock new dimensions of insight and self-discovery.</p>",
//     category: "64d84201618d5d18fb1f3981",
//     excerpt:
//       "Explore the ancient practice of numerology and discover how the numbers in your life can reveal profound insights about your personality and future.",
//     metaDescription:
//       "Learn about numerology, including the significance of Life Path Numbers and Expression Numbers, and how they can provide valuable insights into your life journey.",
//     keywords: [
//       "numerology",
//       "life path number",
//       "numerological insights",
//       "personal growth",
//       "self-discovery",
//     ],
//     createdAt: "2024-09-05T11:41:40.429Z",
//     updatedAt: "2024-09-05T11:41:40.429Z",
//   },
//   {
//     title:
//       "Harnessing the Power of Love: Strategies for a Healthy Relationship",
//     slug: "harnessing-the-power-of-love-strategies-for-a-healthy-relationship",
//     thumbnail: "https://via.placeholder.com/150?text=Love+%26+Relationship",
//     content:
//       "<p>Love is a fundamental aspect of human experience, but maintaining a healthy and fulfilling relationship requires more than just initial attraction. It involves consistent effort, understanding, and communication. In this blog post, we will explore key strategies to help you harness the power of love and build a strong relationship.</p><p>1. **Effective Communication**: Open and honest communication is the cornerstone of any successful relationship. Make time to talk about your feelings, concerns, and dreams with your partner. Active listening and empathy can help resolve conflicts and strengthen your connection.</p><p>2. **Quality Time Together**: Spending quality time together helps to maintain intimacy and connection. Whether it's going on dates, enjoying shared hobbies, or simply having a meal together, make sure to prioritize time with your partner.</p><p>3. **Understanding and Empathy**: Understanding your partner’s needs and perspectives is crucial for a healthy relationship. Show empathy by acknowledging their feelings and experiences, and be willing to compromise and support them.</p><p>4. **Maintaining Individuality**: While it's important to be close with your partner, maintaining your individuality and pursuing your interests is equally vital. Encourage each other to grow and support individual passions and goals.</p><p>5. **Building Trust**: Trust is the foundation of any strong relationship. Be reliable, honest, and transparent with your partner. Avoid actions that might undermine trust and work to rebuild it if it’s ever broken.</p><p>6. **Handling Conflicts**: Disagreements are natural in any relationship, but how you handle them can make a difference. Approach conflicts with a problem-solving mindset rather than blaming. Focus on finding solutions together rather than dwelling on problems.</p><p>7. **Showing Appreciation**: Regularly express appreciation for your partner’s efforts and qualities. Small gestures of gratitude can go a long way in reinforcing your bond and making your partner feel valued.</p><p>8. **Setting Goals Together**: Setting and working towards shared goals can strengthen your partnership. Discuss your future plans and aspirations and work together to achieve them, whether they are related to finances, family, or personal growth.</p><p>9. **Seeking Help When Needed**: Don’t hesitate to seek professional help if you’re struggling with relationship issues. Couples counseling can provide valuable tools and insights to help you navigate challenges and improve your relationship.</p><p>By implementing these strategies, you can create a more loving, supportive, and enduring relationship. Remember that every relationship is unique, and what works for one couple may differ for another. The key is to remain committed to growth, understanding, and mutual respect.</p>",
//     category: "64d84201618d5d18fb1f397e",
//     excerpt:
//       "Learn effective strategies for maintaining a healthy and fulfilling relationship through communication, empathy, and shared goals.",
//     metaDescription:
//       "Explore strategies for a healthy relationship, including communication, quality time, trust, and conflict resolution to enhance your connection with your partner.",
//     keywords: [
//       "relationship advice",
//       "healthy relationships",
//       "communication",
//       "love",
//       "empathy",
//     ],
//     createdAt: "2024-09-05T11:41:40.429Z",
//     updatedAt: "2024-09-05T11:41:40.429Z",
//   },
//   {
//     title: "Mastering the Art of Tarot Reading: A Comprehensive Guide",
//     slug: "mastering-the-art-of-tarot-reading-a-comprehensive-guide",
//     thumbnail: "https://via.placeholder.com/150?text=Tarot+Reading",
//     content:
//       "<p>Tarot reading is a practice that involves interpreting tarot cards to gain insights into various aspects of life, including personal development, relationships, and future possibilities. This comprehensive guide will help you understand the basics of tarot reading and how to get started on your journey.</p><p>1. **Understanding Tarot Decks**: A typical tarot deck consists of 78 cards, divided into the Major Arcana (22 cards) and the Minor Arcana (56 cards). The Major Arcana cards represent significant life events and spiritual lessons, while the Minor Arcana cards focus on everyday situations and experiences.</p><p>2. **Familiarizing Yourself with the Cards**: Each tarot card has its own symbolism and meaning. Spend time studying each card and its interpretations to build a solid foundation. Consider using a tarot guidebook or online resources to deepen your understanding.</p><p>3. **Setting Intentions**: Before beginning a tarot reading, it’s important to set clear intentions. Decide on the focus of your reading, whether it’s a specific question or a general overview of a situation. Setting intentions helps to direct the energy and focus of the reading.</p><p>4. **Shuffling and Drawing Cards**: Shuffle the tarot deck while concentrating on your question or intention. Once you feel ready, draw the cards and lay them out in a spread. Common spreads include the three-card spread (past, present, future) and the Celtic Cross spread for more in-depth readings.</p><p>5. **Interpreting the Cards**: Begin interpreting the cards based on their positions and relationships with each other. Pay attention to the imagery, symbols, and your intuitive feelings. Trust your instincts and allow the cards to guide you in uncovering insights.</p><p>6. **Combining Card Meanings**: Look at how the cards interact with each other to gain a more comprehensive understanding of the reading. Consider the themes and patterns that emerge from the spread, and how they relate to your question or intention.</p><p>7. **Practicing Regularly**: Tarot reading is a skill that improves with practice. Regularly performing readings for yourself or others helps to develop your intuitive abilities and deepen your connection with the cards.</p><p>8. **Respecting the Process**: Approach tarot reading with respect and openness. It’s important to remember that tarot is a tool for guidance and self-reflection, not a means of predicting the future with absolute certainty. Use the insights gained from tarot readings to inform your decisions and actions.</p><p>9. **Exploring Different Decks and Styles**: As you become more experienced, consider exploring different tarot decks and reading styles. Each deck has its own unique symbolism and artistic expression, which can offer new perspectives and insights.</p><p>By mastering the art of tarot reading, you can unlock a valuable tool for personal growth and self-discovery. Whether you use tarot for your own guidance or to assist others, the practice offers a profound way to connect with your inner wisdom and navigate life's journey.</p>",
//     category: "64d84201618d5d18fb1f397f",
//     excerpt:
//       "Discover the basics of tarot reading, including deck structure, card meanings, and how to perform and interpret readings effectively.",
//     metaDescription:
//       "Learn the fundamentals of tarot reading with this comprehensive guide, including deck structure, card meanings, and practical tips for effective readings.",
//     keywords: [
//       "tarot reading",
//       "tarot cards",
//       "divination",
//       "spiritual guidance",
//       "personal growth",
//     ],
//     createdAt: "2024-09-05T11:41:40.429Z",
//     updatedAt: "2024-09-05T11:41:40.429Z",
//   },
//   {
//     title: "Navigating Career Challenges: Strategies for Professional Growth",
//     slug: "navigating-career-challenges-strategies-for-professional-growth",
//     thumbnail: "https://via.placeholder.com/150?text=Career+%26+Job",
//     content:
//       "<p>Career challenges are a common part of professional life, but navigating them effectively can lead to significant personal and professional growth. In this blog post, we’ll explore strategies for overcoming career obstacles and achieving success in your chosen field.</p><p>1. **Identify Your Challenges**: Start by identifying the specific challenges you’re facing in your career. Whether it's a lack of advancement, job dissatisfaction, or skills gaps, understanding the root of the problem is the first step toward finding a solution.</p><p>2. **Set Clear Goals**: Establish clear, actionable career goals to provide direction and motivation. Set both short-term and long-term goals, and create a plan for achieving them. Regularly review and adjust your goals as needed to stay on track.</p><p>3. **Develop Your Skills**: Invest in your professional development by acquiring new skills and knowledge relevant to your field. Consider taking courses, attending workshops, or pursuing certifications to enhance your expertise and increase your value in the job market.</p><p>4. **Seek Feedback and Mentorship**: Actively seek feedback from colleagues, supervisors, and mentors. Constructive feedback can provide valuable insights into areas for improvement and help you refine your skills. Mentorship can offer guidance, support, and career advice from experienced professionals.</p><p>5. **Build a Strong Network**: Networking is crucial for career advancement. Build and maintain relationships with industry professionals, attend networking events, and engage in online communities related to your field. A strong network can open doors to new opportunities and provide support during challenging times.</p><p>6. **Embrace Change**: Career challenges often arise during times of change, such as organizational shifts or industry developments. Embrace change as an opportunity for growth and adaptability. Stay informed about industry trends and be open to new approaches and technologies.</p><p>7. **Manage Stress and Maintain Balance**: Career challenges can be stressful, so it’s important to manage stress and maintain a healthy work-life balance. Practice stress management techniques, such as exercise, mindfulness, and time management, to maintain your well-being and productivity.</p><p>8. **Seek New Opportunities**: If you’re facing persistent challenges in your current role or organization, consider exploring new opportunities. Update your resume, explore job openings, and apply for positions that align with your career goals and interests.</p><p>9. **Stay Resilient**: Resilience is key to overcoming career challenges. Stay positive, persevere through setbacks, and learn from your experiences. Each challenge you face can contribute to your personal and professional growth.</p><p>By implementing these strategies, you can effectively navigate career challenges and continue on the path to professional success. Remember that career growth is a journey, and each challenge you overcome brings you one step closer to achieving your goals.</p>",
//     category: "64d84201618d5d18fb1f3980",
//     excerpt:
//       "Learn strategies for overcoming career challenges and achieving professional growth, including goal setting, skill development, and networking.",
//     metaDescription:
//       "Explore strategies for navigating career challenges and achieving professional growth, including goal setting, skill development, and building a strong network.",
//     keywords: [
//       "career growth",
//       "professional development",
//       "career challenges",
//       "networking",
//       "job success",
//     ],
//     createdAt: "2024-09-05T11:41:40.429Z",
//     updatedAt: "2024-09-05T11:41:40.429Z",
//   },
//   {
//     title: "Healing After a Break-up: A Comprehensive Guide to Moving On",
//     slug: "healing-after-a-break-up-a-comprehensive-guide-to-moving-on",
//     thumbnail: "https://via.placeholder.com/150?text=Break-up+%26+Divorce",
//     content:
//       "<p>Dealing with a break-up can be a challenging and emotional experience. Whether the relationship ended amicably or was marked by conflict, healing and moving on is essential for your well-being. This comprehensive guide provides strategies and tips for navigating the healing process after a break-up.</p><p>1. **Acknowledge Your Emotions**: It’s normal to experience a range of emotions after a break-up, including sadness, anger, and confusion. Allow yourself to feel these emotions and recognize them as a natural part of the healing process.</p><p>2. **Seek Support**: Reach out to friends, family, or a therapist for support. Talking about your feelings with trusted individuals can provide comfort and help you process your emotions. Don’t be afraid to ask for help when you need it.</p><p>3. **Take Care of Yourself**: Prioritize self-care during this time. Engage in activities that promote your physical and emotional well-being, such as exercising, eating healthy, and practicing relaxation techniques. Taking care of yourself can help you regain a sense of balance and stability.</p><p>4. **Reflect on the Relationship**: Take time to reflect on the relationship and what you’ve learned from it. Understanding the dynamics of the relationship and your own needs can provide valuable insights and help you grow from the experience.</p><p>5. **Create Boundaries**: Establish boundaries with your ex-partner to facilitate the healing process. This may include limiting contact or avoiding places you frequented together. Creating physical and emotional distance can help you move on more effectively.</p><p>6. **Focus on Personal Growth**: Use this time to focus on your personal growth and development. Pursue hobbies, set new goals, and work on self-improvement. Channeling your energy into positive activities can help you rebuild your confidence and self-esteem.</p><p>7. **Forgive and Let Go**: Holding onto resentment or anger can hinder your healing process. Practice forgiveness, both towards yourself and your ex-partner, to release negative emotions and move forward. Forgiveness is a crucial step in letting go and finding peace.</p><p>8. **Embrace New Opportunities**: As you heal, embrace new opportunities and experiences. Explore new interests, meet new people, and open yourself up to the possibilities of the future. Embracing change can help you create a new chapter in your life.</p><p>9. **Be Patient with Yourself**: Healing takes time, and there is no set timeline for getting over a break-up. Be patient with yourself and recognize that healing is a gradual process. Allow yourself the time and space to heal at your own pace.</p><p>By following these strategies, you can navigate the healing process and emerge stronger and more resilient. Remember that a break-up is an opportunity for growth and self-discovery, and with time, you can create a fulfilling and meaningful future.</p>",
//     category: "64d84201618d5d18fb1f3982",
//     excerpt:
//       "Discover effective strategies for healing after a break-up, including emotional self-care, personal growth, and embracing new opportunities.",
//     metaDescription:
//       "Explore comprehensive strategies for healing after a break-up, including emotional self-care, reflection, and embracing new opportunities for personal growth.",
//     keywords: [
//       "break-up recovery",
//       "healing after a break-up",
//       "emotional self-care",
//       "personal growth",
//       "moving on",
//     ],
//     createdAt: "2024-09-05T11:41:40.429Z",
//     updatedAt: "2024-09-05T11:41:40.429Z",
//   },
//   {
//     title:
//       "Enhancing Your Marital Life: Tips for Building a Stronger Partnership",
//     slug: "enhancing-your-marital-life-tips-for-building-a-stronger-partnership",
//     thumbnail: "https://via.placeholder.com/150?text=Marital+Life",
//     content:
//       "<p>A strong and fulfilling marital relationship requires ongoing effort and commitment from both partners. Building a stronger partnership involves nurturing your connection, addressing challenges, and growing together. In this blog post, we’ll explore practical tips for enhancing your marital life and creating a lasting bond.</p><p>1. **Prioritize Quality Time**: Make an effort to spend quality time together regularly. Engage in activities that you both enjoy, whether it’s a date night, a shared hobby, or simply spending time talking and connecting. Prioritizing quality time strengthens your emotional connection and intimacy.</p><p>2. **Communicate Openly and Honestly**: Effective communication is essential for a healthy marriage. Be open and honest about your feelings, needs, and concerns. Practice active listening and validate each other’s perspectives to foster understanding and resolve conflicts constructively.</p><p>3. **Show Appreciation and Affection**: Express appreciation and affection for your partner regularly. Small gestures of love, such as compliments, hugs, and acts of kindness, can strengthen your bond and reinforce your commitment to each other.</p><p>4. **Work Together on Goals**: Collaborate on setting and achieving shared goals, whether they relate to finances, family, or personal aspirations. Working together towards common objectives can enhance your sense of partnership and mutual support.</p><p>5. **Address Issues Proactively**: Don’t let problems fester or go unaddressed. When issues arise, tackle them proactively and work together to find solutions. Avoiding or ignoring problems can lead to resentment and strain your relationship.</p><p>6. **Respect Each Other’s Differences**: Embrace and respect each other’s differences and individual traits. Recognize that you may have different opinions, preferences, and ways of doing things. Acknowledge and appreciate these differences as part of what makes your relationship unique.</p><p>7. **Support Each Other’s Growth**: Encourage and support each other’s personal growth and development. Celebrate your partner’s achievements and be there to offer support during challenging times. Supporting each other’s goals and dreams strengthens your partnership and fosters mutual respect.</p><p>8. **Maintain a Sense of Humor**: A sense of humor can be a valuable asset in a marriage. Don’t be afraid to laugh together and find joy in everyday moments. Humor can help diffuse tension and strengthen your bond during difficult times.</p><p>9. **Seek Professional Help if Needed**: If you encounter persistent challenges or difficulties in your marriage, consider seeking the help of a professional therapist or counselor. Professional guidance can provide valuable insights and tools for improving your relationship.</p><p>By implementing these tips, you can build a stronger and more fulfilling marital partnership. Remember that a successful marriage requires ongoing effort, understanding, and love. Embrace the journey of growing together and creating a lasting connection.</p>",
//     category: "64d84201618d5d18fb1f3983",
//     excerpt:
//       "Discover tips for enhancing your marital life, including prioritizing quality time, effective communication, and supporting each other’s growth.",
//     metaDescription:
//       "Explore practical tips for building a stronger marital partnership, including quality time, communication, appreciation, and addressing issues proactively.",
//     keywords: [
//       "marital life",
//       "relationship tips",
//       "marriage improvement",
//       "couple bonding",
//       "partnership",
//     ],
//     createdAt: "2024-09-05T11:41:40.429Z",
//     updatedAt: "2024-09-05T11:41:40.429Z",
//   },
//   {
//     title:
//       "Understanding the Principles of Vedic Astrology: A Guide to Your Birth Chart",
//     slug: "understanding-the-principles-of-vedic-astrology-a-guide-to-your-birth-chart",
//     thumbnail: "https://via.placeholder.com/150?text=Vedic+Astrology",
//     content:
//       "<p>Vedic astrology, also known as Jyotish, is an ancient system of astrology that originated in India. It is based on the principles of the Vedas, the sacred texts of Hinduism. Vedic astrology provides insights into an individual’s life path, personality, and destiny based on the positions of celestial bodies at the time of their birth. This guide explores the fundamental principles of Vedic astrology and how to interpret your birth chart.</p><p>1. **The Birth Chart (Janam Kundali)**: The birth chart, or Janam Kundali, is a key component of Vedic astrology. It is a map of the sky at the exact moment of your birth, showing the positions of the planets, the Sun, and the Moon. The chart is divided into twelve houses, each representing different aspects of life, such as career, relationships, and health.</p><p>2. **The Zodiac Signs (Rashis)**: Vedic astrology uses twelve zodiac signs, or Rashis, to interpret celestial influences. Each sign is associated with specific characteristics and traits. The placement of planets in these signs can provide insights into your personality and life experiences.</p><p>3. **The Planets (Grahas)**: In Vedic astrology, the seven classical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, and Saturn) and two shadow planets (Rahu and Ketu) play a significant role. Each planet has its own qualities and influences, and their positions in your birth chart can affect various aspects of your life.</p><p>4. **The Houses (Bhavas)**: The twelve houses in the birth chart represent different areas of life, such as career, family, and relationships. The planets’ positions in these houses indicate how they influence these aspects. For example, the 10th house represents career and public life, while the 7th house pertains to partnerships and marriage.</p><p>5. **The Ascendant (Lagna)**: The Ascendant, or Lagna, is the zodiac sign rising on the eastern horizon at the time of your birth. It is considered a critical point in the birth chart, influencing your physical appearance, personality, and overall life direction.</p><p>6. **Dashas (Planetary Periods)**: Vedic astrology also incorporates Dashas, or planetary periods, which represent different phases of your life. Each Dasha is ruled by a specific planet and affects your experiences and opportunities during that period.</p><p>7. **Transits (Gocharas)**: Transits refer to the current positions of planets as they move through the zodiac. Vedic astrologers analyze transits to understand how they impact your birth chart and influence your current life circumstances.</p><p>8. **Interpreting Your Chart**: To interpret your birth chart, begin by examining the positions of planets in the signs and houses. Consider their aspects (angular relationships) and how they influence each other. Understanding the interplay of these factors can provide insights into your strengths, challenges, and life path.</p><p>By exploring Vedic astrology and understanding your birth chart, you can gain valuable insights into your life and destiny. While astrology offers guidance, remember that you have the power to shape your own future through your choices and actions.</p>",
//     category: "64d84201618d5d18fb1f3984",
//     excerpt:
//       "Explore the principles of Vedic astrology, including the birth chart, zodiac signs, planets, and houses, and learn how to interpret your astrological chart.",
//     metaDescription:
//       "Discover the principles of Vedic astrology and learn how to interpret your birth chart, including the zodiac signs, planets, houses, and planetary periods.",
//     keywords: [
//       "Vedic astrology",
//       "birth chart",
//       "astrological signs",
//       "Jyotish",
//       "astrological interpretation",
//     ],
//     createdAt: "2024-09-05T11:41:40.429Z",
//     updatedAt: "2024-09-05T11:41:40.429Z",
//   },
//   {
//     title: "The Role of Numerology in Career Success: Discover Your Path",
//     slug: "the-role-of-numerology-in-career-success-discover-your-path",
//     thumbnail: "https://via.placeholder.com/150?text=Numerology",
//     content:
//       "<p>Numerology, the study of numbers and their mystical significance, can offer valuable insights into career success and personal fulfillment. By understanding the influence of numbers in your life, you can make informed decisions and align your career path with your true potential. This blog post explores how numerology can guide you in achieving career success.</p><p>1. **Life Path Number**: Your Life Path Number, derived from your birthdate, reveals your core strengths and life purpose. In the context of your career, understanding your Life Path Number can help you identify professions and roles that align with your natural talents and inclinations. For example, a Life Path Number of 1 often signifies leadership qualities, making careers in management or entrepreneurship a good fit.</p><p>2. **Expression Number**: The Expression Number, calculated from the letters in your full name, represents your inherent skills and abilities. This number can provide insights into your ideal career path and areas where you can excel. For instance, an Expression Number associated with creativity might indicate success in fields such as art or design.</p><p>3. **Soul Urge Number**: Your Soul Urge Number, derived from the vowels in your name, reflects your inner desires and motivations. Understanding this number can help you align your career choices with your true passions and values. A Soul Urge Number that indicates a desire for helping others may point towards careers in counseling or social work.</p><p>4. **Personality Number**: The Personality Number, calculated from the consonants in your name, reveals how others perceive you. This number can provide insights into how you present yourself in the professional world and how you can leverage your strengths to advance your career.</p><p>5. **Career Numbers**: Numerology can also highlight specific numbers associated with career success, such as the numbers in your birthdate or the numbers corresponding to your job or business. Analyzing these numbers can offer additional guidance on favorable career paths and opportunities.</p><p>6. **Timing and Cycles**: Numerology examines the influence of numbers over time, including personal years and cycles. Understanding these cycles can help you identify optimal times for making career changes, starting new projects, or pursuing growth opportunities.</p><p>7. **Personal Development**: Numerology encourages personal development and self-awareness, which are crucial for career success. By understanding your numerological profile, you can work on areas of growth and build on your strengths to achieve your career goals.</p><p>8. **Integrating Numerology into Your Career Planning**: Use numerological insights to inform your career planning and decision-making. Consider how your numbers align with your career aspirations and use this information to guide your choices and strategies for success.</p><p>By incorporating numerology into your career planning, you can gain valuable insights into your strengths, motivations, and ideal career paths. Numerology offers a unique perspective on personal growth and success, helping you to align your career with your true potential.</p>",
//     category: "64d84201618d5d18fb1f3985",
//     excerpt:
//       "Explore the role of numerology in career success, including insights from Life Path Numbers, Expression Numbers, and Soul Urge Numbers.",
//     metaDescription:
//       "Discover how numerology can guide your career success, including insights from Life Path Numbers, Expression Numbers, and Soul Urge Numbers, and how to apply these insights to your career planning.",
//     keywords: [
//       "numerology",
//       "career success",
//       "Life Path Number",
//       "Expression Number",
//       "Soul Urge Number",
//     ],
//     createdAt: "2024-09-05T11:41:40.429Z",
//     updatedAt: "2024-09-05T11:41:40.429Z",
//   },
// ];
// await Blog.insertMany(blogs);
//===================================================
// const mongoose = require("mongoose");
// const User = require("../models/userModel");
// const CallHistory = require("../models/CallHistory");

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// const seedCallHistory = async () => {
//   try {
//     // Fetch astrologers and clients from the database
//     const astrologers = await User.find({ role: "astrologer" })
//       .select("_id")
//       .lean();
//     const clients = await User.find({ role: "customer" }).select("_id").lean();

//     // Check if there are enough astrologers and clients
//     if (astrologers.length === 0 || clients.length === 0) {
//       console.log(
//         "No astrologers or clients found in the database. Please add users first."
//       );
//       return;
//     }

//     // Generate dummy call history data
//     const callHistories = [];

//     for (let i = 0; i < 10; i++) {
//       // Create 10 dummy records
//       const astrologerId =
//         astrologers[Math.floor(Math.random() * astrologers.length)]._id;
//       const clientId = clients[Math.floor(Math.random() * clients.length)]._id;

//       const callStartTime = new Date(
//         Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24)
//       ); // Random start time in the last 24 hours
//       const callEndTime = new Date(
//         callStartTime.getTime() + Math.floor(Math.random() * 1000 * 60 * 30)
//       ); // Random end time within 30 mins of start time
//       const callDuration = Math.floor((callEndTime - callStartTime) / 60000); // Duration in minutes

//       callHistories.push({
//         astrologerId,
//         clientId,
//         callStartTime,
//         callEndTime,
//         callDuration,
//         callStatus: "completed",
//         rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
//         comments: "Great session!", // Sample comment
//       });
//     }

//     // Insert call histories into the database
//     await CallHistory.insertMany(callHistories);
//     console.log("Call history seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding call history:", error);
//   } finally {
//     // Close the connection
//     mongoose.connection.close();
//   }
// };

// // Run the seeding function
// seedCallHistory();
//============================================
// const mongoose = require("mongoose");
// const User = require("../models/userModel"); // Adjust the path if necessary
// const CallHistory = require("../models/CallHistory"); // Adjust the path if necessary

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// const seedCallHistory = async () => {
//   try {
//     // Delete existing call history records
//     await CallHistory.deleteMany();
//     console.log("Existing call history records deleted.");
//     // Fetch astrologers and clients from the database
//     const astrologers = await User.find({ role: "astrologer" })
//       .select("_id")
//       .lean();
//     const clients = await User.find({ role: "customer" }).select("_id").lean();

//     // Check if there are enough astrologers and clients
//     if (astrologers.length === 0 || clients.length === 0) {
//       console.log(
//         "No astrologers or clients found in the database. Please add users first."
//       );
//       return;
//     }

//     // Generate dummy call history data
//     const callHistories = [];

//     // Loop through each astrologer
//     for (const astrologer of astrologers) {
//       // Generate a random number of calls (between 5 and 10)
//       const numCalls = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10

//       for (let i = 0; i < numCalls; i++) {
//         const clientId =
//           clients[Math.floor(Math.random() * clients.length)]._id;

//         const callStartTime = new Date(
//           Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30) // Random start time in the last 30 days
//         );
//         const callEndTime = new Date(
//           callStartTime.getTime() + Math.floor(Math.random() * 1000 * 60 * 30) // Random end time within 30 mins of start time
//         );
//         const callDuration = Math.floor((callEndTime - callStartTime) / 60000); // Duration in minutes

//         callHistories.push({
//           astrologerId: astrologer._id,
//           clientId,
//           callStartTime,
//           callEndTime,
//           callDuration,
//           callStatus: "completed",
//           rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
//           comments: "Great session!", // Sample comment
//         });
//       }
//     }

//     // Insert call histories into the database
//     await CallHistory.insertMany(callHistories);
//     console.log("Call history seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding call history:", error);
//   } finally {
//     // Close the connection
//     mongoose.connection.close();
//   }
// };

// // Run the seeding function
// seedCallHistory();
//==============================================
const sessions = [
  {
    astrologerId: "63a3d0f724fdd3c8506b8f5a", // Example astrologerId (replace with actual ID)
    clientId: "63a3d1f424fdd3c8506b8f5b", // Example clientId (replace with actual ID)
    sessionType: "live", // or "calling" or "live video"
    startTime: new Date("2024-11-15T10:00:00Z"),
    endTime: new Date("2024-11-15T10:30:00Z"),
    duration: 30, // in minutes
    status: "completed", // or "pending", "in-progress"
  },
  {
    astrologerId: "63a3d0f724fdd3c8506b8f5a",
    clientId: "63a3d1f424fdd3c8506b8f5c",
    sessionType: "calling",
    startTime: new Date("2024-11-16T15:00:00Z"),
    endTime: new Date("2024-11-16T15:20:00Z"),
    duration: 20,
    status: "completed",
  },
  {
    astrologerId: "63a3d0f724fdd3c8506b8f5a",
    clientId: "63a3d1f424fdd3c8506b8f5d",
    sessionType: "live video",
    startTime: new Date("2024-11-17T12:00:00Z"),
    endTime: new Date("2024-11-17T12:45:00Z"),
    duration: 45,
    status: "completed",
  },
  {
    astrologerId: "63a3d0f724fdd3c8506b8f5a",
    clientId: "63a3d1f424fdd3c8506b8f5e",
    sessionType: "calling",
    startTime: new Date("2024-11-18T09:30:00Z"),
    endTime: new Date("2024-11-18T09:50:00Z"),
    duration: 20,
    status: "completed",
  },
  {
    astrologerId: "63a3d0f724fdd3c8506b8f5a",
    clientId: "63a3d1f424fdd3c8506b8f5f",
    sessionType: "live",
    startTime: new Date("2024-11-19T14:00:00Z"),
    endTime: new Date("2024-11-19T14:15:00Z"),
    duration: 15,
    status: "completed",
  },
  {
    astrologerId: "63a3d0f724fdd3c8506b8f5a",
    clientId: "63a3d1f424fdd3c8506b8f60",
    sessionType: "live video",
    startTime: new Date("2024-11-20T11:00:00Z"),
    endTime: new Date("2024-11-20T11:30:00Z"),
    duration: 30,
    status: "pending", // You can set this to "pending" if the session hasn't happened yet
  },
  {
    astrologerId: "63a3d0f724fdd3c8506b8f5a",
    clientId: "63a3d1f424fdd3c8506b8f61",
    sessionType: "calling",
    startTime: new Date("2024-11-21T13:00:00Z"),
    endTime: new Date("2024-11-21T13:15:00Z"),
    duration: 15,
    status: "in-progress",
  },
  {
    astrologerId: "63a3d0f724fdd3c8506b8f5a",
    clientId: "63a3d1f424fdd3c8506b8f62",
    sessionType: "live",
    startTime: new Date("2024-11-22T10:00:00Z"),
    endTime: new Date("2024-11-22T10:20:00Z"),
    duration: 20,
    status: "completed",
  },
];

const mongoose = require("mongoose");
const Session = require("../models/sessionModel"); // Import your Session model

async function seedSessions() {
  try {
    await mongoose.connect("mongodb+srv://ajmalshk:dGXU4fTxwIfm1lCV@cluster0.rqu0x8d.mongodb.net/Astrology");

    // Insert the dummy sessions into the database
    await Session.insertMany(sessions);
    console.log("Dummy session data seeded successfully!");

    // Close the connection after seeding
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding session data:", error);
  }
}

seedSessions();


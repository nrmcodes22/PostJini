const {GoogleGenerativeAI}=require('@google/generative-ai');

async function generateTextPost({hotelName, event, occasion}){
    try {
        console.log('🔄 Initializing Gemini for text generation...');
        
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY not found in environment variables');
        }
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({model:"gemini-2.0-flash"});
        
        const prompt = `
        Create a short, elegant social media post text (max 2-3 lines) for the following:

        - Hotel Name: ${hotelName}
        - Event: ${event}
        - Occasion: ${occasion}

        The tone should be classy and inspiring. Do NOT include hashtags.
        `;
        
        console.log('🔄 Sending prompt to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        
        console.log('✅ Text generated successfully:', text.substring(0, 50) + '...');
        return text;
        
    } catch (error) {
        console.error('❌ Error in generateTextPost:', error);
        console.error('Error details:', error.message);
        throw error; // Re-throw to be caught by the main handler
    }
}

module.exports = { generateTextPost };
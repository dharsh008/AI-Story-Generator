from flask import Flask, request, jsonify, render_template
from transformers import pipeline

app = Flask(__name__)

# Try to load the text-generation model globally
# Using distilgpt2 as it is lightweight and faster for generation tasks
print("Loading model... this may take a moment.")
try:
    generator = pipeline('text-generation', model='distilgpt2')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    generator = None

@app.route('/')
def index():
    """Serve the main frontend page."""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_story():
    """API endpoint to generate a story based on the request payload."""
    data = request.json
    prompt = data.get('prompt', '').strip()
    genre = data.get('genre', 'None')
    length = data.get('length', 'Short')

    if not prompt:
        return jsonify({'error': 'Prompt is required.'}), 400

    if generator is None:
        return jsonify({'error': 'Model failed to load. Please check server logs.'}), 500

    # Map length selection to max_new_tokens
    if length == 'Short':
        max_new_tokens = 50
    elif length == 'Medium':
        max_new_tokens = 100
    elif length == 'Long':
        max_new_tokens = 200
    else:
        max_new_tokens = 100

    # Combine genre context with the prompt for better direction
    enhanced_prompt = f"[{genre} Story] {prompt}"

    try:
        # Generate the text
        output = generator(
            enhanced_prompt,
            max_new_tokens=max_new_tokens,
            num_return_sequences=1,
            do_sample=True,         # Adds randomness to the generated text
            temperature=0.8,        # Control the randomness
            top_k=50,               # Limits the sampling pool
            top_p=0.95              # Nucleus sampling
        )
        
        # Extract generated sequence
        story = output[0]['generated_text']
        
        return jsonify({'story': story})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app on localhost
    app.run(debug=True, host='127.0.0.1', port=5000)

document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt');
    const genreSelect = document.getElementById('genre');
    const lengthSelect = document.getElementById('length');
    const generateBtn = document.getElementById('generate-btn');
    const btnText = generateBtn.querySelector('.btn-text');
    const loader = generateBtn.querySelector('.loader');
    const errorMessage = document.getElementById('error-message');
    
    const resultSection = document.getElementById('result-section');
    const storyContent = document.getElementById('story-content');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    let currentStory = '';

    generateBtn.addEventListener('click', async () => {
        const promptText = promptInput.value.trim();
        
        if (!promptText) {
            errorMessage.classList.remove('error-hidden');
            promptInput.focus();
            return;
        }
        
        errorMessage.classList.add('error-hidden');
        
        // Update UI to loading state
        generateBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        resultSection.classList.add('hidden');
        
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: promptText,
                    genre: genreSelect.value,
                    length: lengthSelect.value
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                currentStory = data.story;
                storyContent.textContent = currentStory;
                resultSection.classList.remove('hidden');
                // Smooth scroll to results
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                alert(`Error: ${data.error || 'Failed to generate story'}`);
            }
        } catch (error) {
            console.error('Error generating story:', error);
            alert('An error occurred while communicating with the server.');
        } finally {
            // Restore UI state
            generateBtn.disabled = false;
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });

    copyBtn.addEventListener('click', async () => {
        if (!currentStory) return;
        try {
            await navigator.clipboard.writeText(currentStory);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard.');
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (!currentStory) return;
        const blob = new Blob([currentStory], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AI_Generated_Story.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});

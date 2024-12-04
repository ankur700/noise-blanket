const OFFSCREEN_DOCUMENT_URL = './src/offscreen/index.html';

async function handlePlayAudio(audioUrl, volume) {
  try {
    // Check if offscreen API is available
    if (!chrome.offscreen || typeof chrome.offscreen.createDocument !== 'function') {
      console.error('Offscreen API not available');
      return;
    }

    // Use optional chaining and try-catch for checking document existence
    let hasDocument = false;
    try {
      hasDocument = await chrome.offscreen.hasDocument();
    } catch (checkError) {
      console.log('Error checking offscreen document:', checkError);
    }

    if (!hasDocument) {
      try {
        await chrome.offscreen.createDocument({
          url: OFFSCREEN_DOCUMENT_URL,
          reasons: ['AUDIO_PLAYBACK'],
          justification: 'Playing background audio'
        });

      } catch (createError) {
        console.error('Failed to create offscreen document:', createError);
        return;
      }
    }

    // Send play message to offscreen document
    chrome.runtime.sendMessage({
      type: 'PLAY_AUDIO_OFFSCREEN',
      audioUrl: audioUrl,
      volume: volume
    });
  } catch (error) {
    console.error('Error in handlePlayAudio:', error);
  }
}

// Modify the message listener to include error handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case 'PLAY_AUDIO':
        handlePlayAudio(message.audioUrl, message.volume);
        break;
      case 'STOP_AUDIO':
        handleStopAudio(message.audioUrl);
        break;
      case 'STOP_ALL_AUDIO':
        stopAllAudios();
        break;
      case 'RESUME_ALL_AUDIO':
        resumeAllAudios();
        break;
      case 'SET_VOLUME':
        setAudioVolume(message.audioUrl, message.volume);
      break;
    }
  } catch (error) {
    console.error('Error in message listener:', error);
  }
});

// Additional error handling for other functions
function handleStopAudio(audioUrl) {
  try {
    chrome.runtime.sendMessage({
      type: 'STOP_AUDIO_OFFSCREEN',
      audioUrl: audioUrl
    });
  } catch (error) {
    console.error('Error stopping audio:', error);
  }
}

function stopAllAudios() {
  try {
    chrome.runtime.sendMessage({
      type: 'STOP_ALL_AUDIO_OFFSCREEN'
    });
  } catch (error) {
    console.error('Error stopping all audios:', error);
  }
}

function resumeAllAudios() {
  try {
    chrome.runtime.sendMessage({
      type: 'RESUME_ALL_AUDIO_OFFSCREEN'
    });
  } catch (error) {
    console.error('Error resuming all audios:', error);
  }
}

function setAudioVolume(audioUrl, volume) {
  try {
    chrome.runtime.sendMessage({
      type: 'SET_VOLUME_OFFSCREEN',
      audioUrl: audioUrl,
      volume: volume
    });
  } catch (error) {
    console.error('Error stopping all audios:', error);
  }
}
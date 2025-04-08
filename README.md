# Video Stress Analysis System

A web-based application that records and analyzes videos to detect stress levels using multimodal analysis (text, audio, and visual cues).

## Features

- Video recording with webcam
- Video file upload support
- Real-time video preview
- Multimodal stress analysis:
  - Text Analysis
  - Acoustic Analysis
  - Visual Analysis
- Combined stress score calculation
- Historical recording management
- User profile management
- Professional consultation support

## Tech Stack

- React 19
- Vite
- React Router Dom
- WebRTC (MediaRecorder API)
- REST API integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with webcam support

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd react-recorder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── services/          # API services
└── assets/           # Static assets
```

## Usage

1. Navigate to the Video Recorder page
2. Grant camera/microphone permissions
3. Record a video or upload an existing one
4. Process the video for stress analysis
5. View the detailed analysis results

## Analysis Results

The system provides three types of analysis:
- Text Analysis: Analyzes speech-to-text content
- Acoustic Analysis: Analyzes voice patterns
- Visual Analysis: Analyzes facial expressions and gestures

Results include:
- Individual stress probabilities for each analysis type
- Confidence levels
- Combined stress score
- Risk level assessment
- Professional interpretation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is part of a Final Year Project (FYP) and is subject to academic guidelines.

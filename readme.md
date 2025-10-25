# Yaprax Downloader - A WGET Based Download Manager

A beautiful, modern graphical interface for wget with queue system, dark mode, desktop notifications, and quick actions for power users.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-lightgrey)

**Created by:** Aga Ismael Abdalla  
**Website:** [linux.krd](https://linux.krd)  
**GitHub:** [@petrichor-494](https://github.com/petrichor-494)

---

## 🎯 How It Works

1. **Frontend (React)** - Beautiful, responsive user interface
2. **Electron Main Process** - Executes wget commands securely
3. **Queue Manager** - Handles multiple downloads (max 3 concurrent)
4. **Progress Parser** - Real-time parsing of wget output
5. **Persistent Storage** - History and preferences saved locally

---

## 📁 Project Structure

```
yaprax-downloader/
├── main.js           # Electron main process (backend logic)
├── preload.js        # Security bridge (IPC communication)
├── index.html        # React application (frontend UI)
├── package.json      # Dependencies and build config
├── LICENSE           # MIT License
└── README.md         # This file
```

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run build:linux   # For Linux
npm run build:win     # For Windows
npm run build:mac     # For macOS
```

---

## 🔧 Configuration

### Download Options
Configure common wget flags through the UI:
- **Continue downloads** - Resume interrupted downloads
- **Recursive** - Download entire websites
- **Timestamping** - Only download newer files
- **No cache** - Bypass proxy caches
- **User agent** - Custom user agent string
- **Rate limiting** - Control bandwidth usage (e.g., 500k, 1M, 2M)

### Concurrent Downloads
- Maximum 3 simultaneous downloads
- Additional downloads queue automatically
- Modify `MAX_CONCURRENT` in `main.js` to change limit

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions
- [ ] Browser extension integration
- [ ] Torrent support
- [ ] FTP/SFTP protocols
- [ ] Proxy configuration UI
- [ ] Download scheduling
- [ ] Themes and customization
- [ ] Multi-language support
- [ ] Statistics dashboard

---

## 🐛 Known Issues

- Progress parsing may vary slightly with different wget versions
- Some special characters in filenames may not display correctly
- Notification permissions must be granted manually on some systems

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Queue system with concurrent downloads
- ✅ Dark mode with persistent preferences
- ✅ Desktop notifications
- ✅ Context menu with quick actions
- ✅ Real-time progress tracking
- ✅ Download history
- ✅ All major wget options
- ✅ Beautiful modern UI

---

## 🔒 Security

- Sandboxed execution environment
- No telemetry or tracking
- All data stored locally
- Secure IPC communication
- Input validation and sanitization

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

Copyright (c) 2025 Aga Ismael Abdalla

---

## 🙏 Acknowledgments

Built with:
- [Electron](https://www.electronjs.org/) - Cross-platform desktop apps
- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [wget](https://www.gnu.org/software/wget/) - Network downloader

---

## 💬 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/petrichor-494/yaprax-downloader/issues)
- **Website:** [linux.krd](https://linux.krd)
- **Email:** agaesmaeel@gmail.com

---

## 🌟 Star History

If you find Yaprax Downloader useful, please consider giving it a star on GitHub! ⭐

---

## 📊 Stats

- **Language:** JavaScript (React + Node.js)
- **Platform:** Cross-platform (Linux, Windows, macOS)
- **License:** MIT (Free and Open Source)
- **Downloads:** Check [Releases](https://github.com/petrichor-494/yaprax-downloader/releases)

---

Made with ❤️ by [Aga Ismael Abdalla](https://linux.krd) for the open-source community ✨ Features

### 🎯 Core Features
- **Queue System** - Add multiple downloads and process them automatically
- **Real-time Progress** - Live speed, progress percentage, and ETA for each download
- **Download History** - Track all downloads with timestamps and file sizes
- **Smart Resume** - Continue interrupted downloads automatically with `-c` flag
- **Directory Browser** - Easy output directory selection

### 🎨 User Interface
- **Dark Mode** - Easy on the eyes with beautiful dark theme
- **Modern Design** - Gradient themes and smooth animations
- **Responsive** - Works perfectly on any screen size
- **Context Menus** - Right-click for quick actions

### ⚡ Quick Actions
- **Open File** - Launch downloaded files directly
- **Open File Location** - Jump to file in file manager
- **Download Again** - Retry failed or re-download files
- **Delete from History** - Clean up your download history

### 🔔 Notifications
- **Desktop Notifications** - Get notified when downloads complete
- **System Integration** - Native OS notifications

### ⚙️ wget Options
- Continue partial downloads (`-c`)
- Recursive download (`-r`)
- Timestamping (`-N`)
- Bypass cache (`--no-cache`)
- Custom user agent
- Bandwidth limiting (`--limit-rate`)

---

## 📋 Prerequisites

**wget must be installed:**

```bash
# Ubuntu/Debian
sudo apt install wget

# Fedora
sudo dnf install wget

# Arch Linux
sudo pacman -S wget

# macOS (via Homebrew)
brew install wget
```

---

## 🚀 Installation

### From Source

1. **Clone the repository:**
```bash
git clone https://github.com/petrichor-494/yaprax-downloader.git
cd yaprax-downloader
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the application:**
```bash
npm start
```

### Building Installers

**For Linux:**
```bash
npm run build:linux
```
Creates `.AppImage` and `.deb` packages in `dist/` folder.

**For Windows:**
```bash
npm run build:win
```

**For macOS:**
```bash
npm run build:mac
```

---

## 💡 Usage Guide

### Basic Download
1. Enter or paste download URL
2. Choose save location (default: ~/Downloads)
3. Click "Add to Queue"
4. Watch real-time progress

### Queue Multiple Downloads
1. Add multiple URLs - they'll queue automatically
2. Up to 3 downloads run simultaneously
3. Cancel individual downloads or clear entire queue

### Quick Actions
- **Right-click** on any history item for quick actions
- **Open file** to launch the downloaded file
- **Open location** to view file in file manager
- **Download again** to retry/re-download
- **Delete** to remove from history

### Dark Mode
- Click the moon/sun icon in top-right corner
- Preference is saved automatically

---

##
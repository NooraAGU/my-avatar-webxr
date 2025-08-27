# Virtual FAQ Assistant - 3D Avatar

A professional virtual chat agent using Ready Player Me 3D avatars. Perfect for customer support, FAQ systems, and interactive help desks.

## ✨ Features

- 🤖 Professional virtual assistant interface
- 👤 Lifelike 3D Ready Player Me avatar
- 💼 Suitable for business FAQ and support
- 🎭 Natural idle animations (breathing, subtle movements)
- 💡 Professional lighting and styling
- 📱 Responsive design for all devices
- ⚡ Fast loading with status indicators
- 🎯 Glass-morphism UI design

## 🚀 Live Demo

Visit: `https://yourusername.github.io/your-repo-name/`

*Your professional virtual assistant is ready to help with customer inquiries*

## 📋 Setup Instructions

### For GitHub Pages

1. **Fork or clone this repository**
2. **Replace the avatar file:**
   - Export your avatar from [Ready Player Me](https://readyplayer.me/) in GLB format
   - Replace `docs/avatar.glb` with your avatar file
   - Make sure to name it exactly `avatar.glb`
3. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Scroll to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "docs" folder
   - Save the settings
4. **Access your viewer:**
   - GitHub will provide a URL like: `https://yourusername.github.io/repository-name/`
   - Your avatar viewer will be live within a few minutes

### File Structure
```
docs/
├── index.html      # Main avatar viewer page
└── avatar.glb      # Your Ready Player Me avatar file
```

## 🎮 Controls

- **Mouse drag**: Rotate the view around your avatar
- **Mouse wheel**: Zoom in and out
- **Right-click + drag**: Pan the view
- **Double-click**: Reset camera to default position

## 🔧 Technical Details

- **Framework**: Pure HTML5 + ES6 Modules
- **3D Engine**: Three.js v0.158.0
- **Model Format**: GLB (optimized GLTF)
- **Dependencies**: Loaded via CDN (no build process required)

## 🎨 Customization

You can customize the viewer by editing `docs/index.html`:

- **Lighting**: Modify the `HemisphereLight` and `DirectionalLight` settings
- **Camera**: Adjust initial position and field of view
- **Animation**: Change rotation speed in the `animate` functions
- **Styling**: Update CSS for colors, positioning, and UI elements

## 📱 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🐛 Troubleshooting

### Avatar not loading?
1. Make sure your GLB file is exactly named `avatar.glb`
2. Check that the file is under 10MB (GitHub file limit)
3. Verify the GLB file is valid by testing in other 3D viewers
4. The viewer will show a blue test cube if the avatar fails to load

### White screen?
1. Check browser console for JavaScript errors
2. Ensure your browser supports ES6 modules
3. Try refreshing the page
4. Verify the GitHub Pages deployment is successful

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Made with ❤️ for the Ready Player Me community
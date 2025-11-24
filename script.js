document.addEventListener("DOMContentLoaded", () => {
  // Focus Input logic
  const cmdInput = document.querySelector(".cmd-input");
  if (cmdInput) {
    // Focus immediately
    cmdInput.focus();

    // Focus when clicking anywhere in the terminal
    document
      .getElementById("terminal")
      .addEventListener("click", () => cmdInput.focus());

    // Focus when hitting '/' key
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        cmdInput.focus();
      }
    });
  }

  // --- SYSTEM STATS SIMULATOR ---
  function updateStats() {
    const cpu = Math.floor(Math.random() * 20) + 5; // 5-25%
    const ram = (Math.random() * (8.5 - 3.5) + 3.5).toFixed(1); // 3.5-8.5GB
    const net = Math.floor(Math.random() * 30) + 10; // 10-40ms

    const cpuEl = document.getElementById("cpuVal");
    const memEl = document.getElementById("memVal");
    const netEl = document.getElementById("netVal");

    if (cpuEl) cpuEl.textContent = `${cpu}%`;
    if (memEl) memEl.textContent = `${ram}GB`;
    if (netEl) netEl.textContent = `${net}ms`;
  }
  setInterval(updateStats, 2000);
  updateStats();

  // --- WEATHER FETCH ---
  async function getWeather(lat, lon) {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      const temp = Math.round(data.current_weather.temperature);
      const wTemp = document.querySelector(".w-temp");
      const wIcon = document.querySelector(".w-icon");
      const weatherWidget = document.getElementById("weatherWidget");

      // Update Dock Widget
      if (wTemp) wTemp.textContent = `${temp}°`;

      const code = data.current_weather.weathercode;
      // Simple code mapping
      let icon = "☀️";
      let desc = "Clear Sky";

      if (code > 3 && code < 50) {
        icon = "☁️";
        desc = "Cloudy";
      } else if (code >= 50) {
        icon = "🌧️";
        desc = "Rain";
      }

      if (wIcon) wIcon.textContent = icon;
      if (weatherWidget)
        weatherWidget.setAttribute(
          "title",
          `${desc} • Wind: ${data.current_weather.windspeed}km/h`
        );

      // UPDATE TERMINAL LOG
      const logEnv = document.getElementById("logEnv");
      if (logEnv) {
        // Simulate fetching city name (mocked as London for robustness without API key)
        const city = lat === 51.5074 ? "London" : "Local";
        logEnv.innerHTML = `<span class="ts">[0.02s]</span> <span class="success">✔ Env: ${city} • ${temp}°C • ${desc}</span>`;
      }
    } catch (e) {
      console.error("Weather Error", e);
    }
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
        // FALLBACK TO LONDON IF BLOCKED
        getWeather(51.5074, -0.1278);
      }
    );
  } else {
    // Fallback if no geo support
    getWeather(51.5074, -0.1278);
  }
});

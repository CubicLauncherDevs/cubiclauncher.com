<script>
  /** Colores de la bandera — paleta pastel (igual a asd.svg) */
  export let colorCanton = "#4C6FA5"; // Azul grisáceo del cantón
  export let colorWhite = "#F2F1EE"; // Blanco roto
  export let colorRed = "#B5645C"; // Rojo terracota
  export let colorStar = "#F2F1EE"; // Estrella

  export let strokeColor = "#3a2e2c";
  export let strokeWidth = 3;

  export let opacity = 1;

  export let width = "1rem";

  export let height = "1rem";

  export let className = "";

  export let label = "CubicLauncher";
</script>

<svg
  {width}
  {height}
  viewBox="0 0 512 512"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label={label}
  class={className}
>
  <defs>
    <clipPath id="polyClip">
      <path
        d="m 86.694479,219.56319 -0.628221,126.5865 166.164412,96.43191 h 12.25031 l 164.90798,-99.88712 -59.68098,-32.66749 -0.31411,-118.73374 -101.77178,57.1681 -0.94234,115.90675 56.53988,-34.86626 24.81473,12.25031 -84.49571,56.85399 -137.26626,-73.81596 -0.31411,-81.66871 z"
      />
      <path
        d="M 147.03656,307.84393 148.36922,237.21307 85.752147,199.42086 85.678784,143.92703 250.97423,42.404908 h 6.59632 l 172.13252,99.258892 0.31411,164.90798 -39.57792,-21.67362 -0.31411,-114.96442 -134.43926,-76.642942 -125.95828,73.501842 0.0196,10.26748 119.89202,69.86994 -0.23558,117.9092 z"
      />
      <path
        d="m 156.42699,174.6454 100.82945,-57.79632 102.4,57.48221 -100.20123,57.48221 z"
      />
    </clipPath>
  </defs>

  <g clip-path="url(#polyClip)" {opacity}>
    <g transform="translate(85,42) scale(0.66601562,0.78320312)">
      <rect x="0" y="0" width="256" height="256" fill={colorCanton} />
      <rect x="256" y="0" width="256" height="256" fill={colorWhite} />
      <rect x="0" y="256" width="512" height="256" fill={colorRed} />
      <polygon
        points="128,58 145,101 191,103 154,132 168,178 128,151 88,178 102,132 65,103 111,101"
        fill={colorStar}
      />
    </g>
  </g>

  <g
    fill="none"
    stroke={strokeColor}
    stroke-width={strokeWidth}
    stroke-linejoin="round"
  >
    <path
      d="m 86.694479,219.56319 -0.628221,126.5865 166.164412,96.43191 h 12.25031 l 164.90798,-99.88712 -59.68098,-32.66749 -0.31411,-118.73374 -101.77178,57.1681 -0.94234,115.90675 56.53988,-34.86626 24.81473,12.25031 -84.49571,56.85399 -137.26626,-73.81596 -0.31411,-81.66871 z"
    />
    <path
      d="M 147.03656,307.84393 148.36922,237.21307 85.752147,199.42086 85.678784,143.92703 250.97423,42.404908 h 6.59632 l 172.13252,99.258892 0.31411,164.90798 -39.57792,-21.67362 -0.31411,-114.96442 -134.43926,-76.642942 -125.95828,73.501842 0.0196,10.26748 119.89202,69.86994 -0.23558,117.9092 z"
    />
    <path
      d="m 156.42699,174.6454 100.82945,-57.79632 102.4,57.48221 -100.20123,57.48221 z"
    />
  </g>
</svg>

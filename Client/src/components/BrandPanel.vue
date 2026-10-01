<template>
  <section class="brand-panel">
    <div class="stain-mark" aria-hidden="true">
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <path
          class="ring ring-a"
          d="M200 40c92 0 158 66 158 152s-70 158-158 158S46 278 46 192 108 40 200 40Z"
        />
        <path
          class="ring ring-b"
          d="M214 70c76 4 132 66 128 140s-70 128-146 122S66 260 70 186 138 66 214 70Z"
        />
      </svg>
    </div>

    <div class="brand-copy">
      <p class="eyebrow">Est. one spilled cup, and never the same since</p>
      <h1>The Coffee&#8209;Stain Library</h1>
      <p class="tagline">
        Every book has a home, and every home is tracked &mdash; even the ones
        currently out on loan.
      </p>
    </div>

    <p class="brand-footnote">
      A member account gets you borrowing privileges. Staff accounts manage
      the shelves.
    </p>
  </section>
</template>

<style scoped>
.brand-panel {
  position: relative;
  background: var(--ink);
  color: var(--paper);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rem 3.5rem;
  overflow: hidden;
}

.stain-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 640px;
  height: 640px;
  transform: translate(-42%, -55%);
  opacity: 0.9;
  pointer-events: none;
}

.stain-mark .ring {
  fill: none;
  stroke: var(--stain);
}

.ring-a {
  stroke-width: 3;
  opacity: 0.35;
}

.ring-b {
  stroke-width: 2;
  opacity: 0.22;
  stroke: var(--gold);
}

.brand-copy {
  position: relative;
  max-width: 30rem;
}

.eyebrow {
  font-size: 0.78rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0 0 1.1rem;
}

.brand-copy h1 {
  font-family: "Fraunces", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-size: clamp(2.2rem, 3.4vw, 3.1rem);
  line-height: 1.08;
  margin: 0 0 1.1rem;
}

.tagline {
  font-size: 1.02rem;
  line-height: 1.6;
  color: #d8d2c4;
  margin: 0;
}

.brand-footnote {
  position: relative;
  font-size: 0.86rem;
  color: #a49c8b;
  max-width: 24rem;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 860px) {
  .brand-panel {
    padding: 3rem 2rem 2.5rem;
    min-height: 260px;
  }
  .stain-mark {
    width: 420px;
    height: 420px;
  }
}
</style>
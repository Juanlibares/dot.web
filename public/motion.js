if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      entry.target.classList.replace("reveal-pending", "reveal-visible");
      observer.unobserve(entry.target);
    }
  });

  for (const element of document.querySelectorAll(".project, .timeline, .hire, .contact")) {
    if (element.getBoundingClientRect().top < window.innerHeight) continue;

    element.classList.add("reveal-pending");
    observer.observe(element);
  }
}

// Keep every card in normal document flow so long content remains readable.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const stackGroups = [
  [...document.querySelectorAll('#proyectos > .project')],
  [...document.querySelectorAll('.hire-grid > div')],
];
let scrollFrame = 0;
function updateStacks() {
  scrollFrame = 0;
  const header = document.querySelector('.top').getBoundingClientRect().height;
  for (const cards of stackGroups) {
    cards.forEach((card, index) => {
      const top = Math.min(header + 24, innerHeight - card.offsetHeight - 28);
      card.style.setProperty('--stack-top', `${top}px`);
      const next = cards[index + 1];
      const progress = next ? Math.max(0, Math.min(1, (innerHeight - next.getBoundingClientRect().top) / (innerHeight - header))) : 0;
      card.style.setProperty('--stack-scale', 1 - progress * .035);
      card.style.setProperty('--stack-shade', progress * .07);
    });
    // Finish masking the previous card as the incoming card reaches its sticky
    // position, which can differ when the cards have different heights.
    cards.forEach((card, index) => {
      const next = cards[index + 1];
      if (!next) return;
      const bounds = card.getBoundingClientRect();
      const nextTop = next.getBoundingClientRect().top;
      const stickyTop = Math.min(header + 24, innerHeight - next.offsetHeight - 28);
      const overlap = Math.max(0, Math.min(bounds.height, bounds.bottom - nextTop));
      const takeover = Math.max(0, 1 - Math.max(0, nextTop - stickyTop) / 48);
      const covered = Math.max(overlap / (bounds.height || 1), takeover);
      card.style.setProperty('--stack-covered', `${card.offsetHeight * covered}px`);
    });
  }
}
function requestStackFrame() {
  if (!scrollFrame && !motionPreference.matches) scrollFrame = requestAnimationFrame(updateStacks);
}
function configureStacks() {
  stackGroups.forEach(cards => cards.forEach((card, index) => {
    card.classList.toggle('scroll-card', !motionPreference.matches);
    card.style.zIndex = motionPreference.matches ? '' : index + 1;
  }));
  requestStackFrame();
}
addEventListener('scroll', requestStackFrame, { passive: true });
addEventListener('resize', requestStackFrame);
addEventListener('load', requestStackFrame);
addEventListener('animationend', requestStackFrame);
motionPreference.addEventListener('change', configureStacks);
if ('ResizeObserver' in window) {
  const resize = new ResizeObserver(requestStackFrame);
  stackGroups.flat().forEach(card => resize.observe(card));
}
configureStacks();

const navigation = document.querySelector('.top');
let previousScroll = Math.max(0, scrollY);
let directionDistance = 0;
addEventListener('scroll', () => {
  const current = Math.max(0, scrollY);
  const delta = current - previousScroll;
  previousScroll = current;
  if (current < 80) {
    navigation.classList.remove('nav-hidden');
    directionDistance = 0;
    return;
  }
  if (Math.sign(delta) !== Math.sign(directionDistance)) directionDistance = 0;
  directionDistance += delta;
  if (Math.abs(directionDistance) > 10) {
    navigation.classList.toggle('nav-hidden', directionDistance > 0 && !navigation.contains(document.activeElement));
    directionDistance = 0;
  }
}, { passive: true });
navigation.addEventListener('focusin', () => navigation.classList.remove('nav-hidden'));

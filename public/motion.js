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
  [...document.querySelectorAll('#proyectos > .featured, #proyectos > .project, #proyectos > .more')],
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
    // Mask the covered card down to the incoming card's top edge, regardless
    // of either card's height. Recompute on reverse scroll and resize as well.
    cards.forEach((card, index) => {
      const next = cards[index + 1];
      const bounds = card.getBoundingClientRect();
      const scale = bounds.height / card.offsetHeight || 1;
      const covered = next ? Math.max(0, Math.min(bounds.height, bounds.bottom - next.getBoundingClientRect().top)) / scale : 0;
      card.style.setProperty('--stack-covered', `${covered}px`);
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

export type FirstAidStep = {
  text: string;
  warning?: string;
};

export type FirstAidScenario = {
  id: string;
  title: string;
  summary: string;
  emoji: string;
  steps: FirstAidStep[];
  callIf: string;
};

export const firstAidScenarios: FirstAidScenario[] = [
  {
    id: "heavy-bleeding",
    title: "Heavy Bleeding",
    summary: "Apply firm pressure and keep it there until help arrives.",
    emoji: "🩸",
    steps: [
      {
        text: "Put on gloves if available. Apply firm, direct pressure to the wound using a clean cloth or clothing.",
      },
      {
        text: "If the cloth soaks through, add more cloth on top — do NOT remove the first layer.",
        warning:
          "Do NOT lift the cloth to check the wound — this disturbs clot formation and restarts bleeding.",
      },
      {
        text: "If the wound is on a limb, raise it above heart level while maintaining pressure.",
      },
      {
        text: "Hold continuous pressure for at least 10 minutes without releasing.",
      },
      {
        text: "If bleeding is from a limb, is life-threatening, and does not respond to pressure, a tourniquet may be applied 5–8 cm above the wound as a last resort.",
        warning:
          "Do NOT apply a tourniquet unless bleeding is uncontrollable — incorrect use can cause permanent nerve and tissue damage.",
      },
    ],
    callIf:
      "Call 108 immediately if bleeding is severe, does not slow after 10 minutes of direct pressure, or the person shows signs of shock: pale or cold skin, rapid weak pulse, or confusion.",
  },
  {
    id: "cpr",
    title: "CPR (No Pulse / Not Breathing)",
    summary:
      "Chest compressions keep blood moving. Start immediately — every second counts.",
    emoji: "🫀",
    steps: [
      {
        text: "Check responsiveness — tap both shoulders firmly and shout 'Are you OK?'",
      },
      {
        text: "Call 112 immediately, or shout at a bystander to call while you begin.",
      },
      {
        text: "Lay the person flat on their back on a firm surface.",
      },
      {
        text: "Place the heel of one hand on the centre of the chest (between the nipples). Place your other hand on top, fingers interlaced. Keep arms straight.",
      },
      {
        text: "Push down hard and fast — at least 5 cm deep, at roughly 100–120 compressions per minute (the beat of 'Stayin' Alive'). Let the chest fully recoil between compressions.",
        warning:
          "Do NOT stop to check for a pulse during compressions — interruptions significantly reduce survival chances.",
      },
      {
        text: "If trained in rescue breathing, give 2 breaths after every 30 compressions. If not trained, continue hands-only compressions without stopping.",
      },
      {
        text: "Continue until the person breathes normally, a trained responder takes over, or you are physically unable to continue.",
      },
    ],
    callIf:
      "Call 112 immediately. Do not leave the person alone — ask a bystander to call while you begin compressions.",
  },
  {
    id: "unconscious",
    title: "Unconscious Person",
    summary:
      "Keep their airway open and call for help. Do not leave them alone.",
    emoji: "😵",
    steps: [
      {
        text: "Tap both shoulders and shout loudly. If no response, they are unconscious.",
      },
      {
        text: "Call 112 immediately, or ask a bystander to call while you help.",
      },
      {
        text: "Check for breathing — look for chest rise, listen, and feel for breath on your cheek for up to 10 seconds.",
      },
      {
        text: "If NOT breathing, begin CPR immediately (see CPR scenario).",
      },
      {
        text: "If breathing normally, place them in the recovery position: gently roll them onto their side, tilt the head back slightly to keep the airway open, and bend the top knee forward to stabilise them.",
        warning:
          "Do NOT move the person if a neck or spinal injury is suspected (e.g. fallen from height or vehicle accident). Only move if essential to maintain the airway.",
      },
      {
        text: "Do NOT give food, water, or any medication to an unconscious person.",
      },
      {
        text: "Stay with them, monitor breathing, and keep them warm until emergency services arrive.",
      },
    ],
    callIf:
      "Call 112 immediately. An unconscious person always requires emergency medical assessment, even if they appear to recover.",
  },
  {
    id: "burns",
    title: "Burns",
    summary:
      "Cool with running water for 20 minutes. Cover loosely. Do not use ice or home remedies.",
    emoji: "🔥",
    steps: [
      {
        text: "Remove the person from the heat source. Do NOT remove clothing that is stuck to burned skin.",
      },
      {
        text: "Cool the burn immediately with cool (not cold) running water for at least 10–20 minutes.",
        warning:
          "Do NOT use ice, ice water, or very cold water — this causes further tissue damage and increases the risk of shock.",
      },
      {
        text: "While cooling, remove jewellery, watches, or tight items near the burn before swelling begins.",
      },
      {
        text: "Cover the burn loosely with a clean, non-fluffy material — cling film (plastic wrap) laid flat, or a clean plastic bag work well.",
      },
      {
        text: "Do NOT apply butter, toothpaste, oil, or any home remedy to a burn.",
        warning:
          "Home remedies like butter, toothpaste, or oil trap heat in the skin and cause serious infection.",
      },
      {
        text: "Do NOT burst any blisters — broken blisters increase the risk of infection.",
      },
    ],
    callIf:
      "Call 108 for any burn larger than the victim's palm, burns to the face, hands, feet, or genitals, chemical or electrical burns, or any burn in a child. Call 112 if the airway may be burned (hoarse voice, difficulty breathing, singed nose hairs).",
  },
  {
    id: "fracture",
    title: "Broken Bone / Suspected Fracture",
    summary:
      "Immobilise in the position found. Do not try to straighten or move it.",
    emoji: "🦴",
    steps: [
      {
        text: "Do NOT move the injured limb or attempt to straighten it.",
        warning:
          "Do NOT push a visible bone back in — this causes severe infection and further injury.",
      },
      {
        text: "Support the injury in the position you find it using rolled clothing, a folded jacket, or padding on either side.",
      },
      {
        text: "If a rigid splint is available, pad it well and tie it loosely above and below the fracture — NOT over the fracture site itself.",
        warning:
          "Do NOT apply a splint too tightly — check for adequate circulation (warmth, colour, sensation) in the fingers or toes every 10 minutes.",
      },
      {
        text: "Elevate the limb gently above heart level if the person can tolerate it, to reduce swelling.",
      },
      {
        text: "Apply a cold pack wrapped in cloth to help reduce pain and swelling. Do NOT apply ice directly to skin.",
      },
      {
        text: "Keep the person warm, calm, and still until emergency services arrive.",
      },
    ],
    callIf:
      "Call 108 if the bone is visible through the skin (open fracture), the limb is severely deformed, the person cannot move or bear weight, or if circulation below the injury is lost (cold, numb, or discoloured fingers/toes).",
  },
  {
    id: "choking",
    title: "Choking",
    summary:
      "If they can cough, let them. If they cannot speak or breathe, act immediately.",
    emoji: "🚫",
    steps: [
      {
        text: "Ask 'Are you choking?' — if the person can cough forcefully, speak, or breathe, encourage them to keep coughing. Do not intervene yet.",
        warning:
          "Do NOT perform back blows or abdominal thrusts on someone who is still coughing effectively — it may push the object deeper.",
      },
      {
        text: "If they cannot cough, speak, or breathe: lean them forward and give up to 5 firm back blows between the shoulder blades using the heel of your hand.",
      },
      {
        text: "If back blows fail: stand behind them, make a fist just above their navel, grasp your fist with your other hand, and pull sharply inward and upward up to 5 times (Heimlich manoeuvre).",
        warning:
          "Do NOT use abdominal thrusts on infants under 1 year, pregnant persons, or very obese individuals — use back blows and chest thrusts instead.",
      },
      {
        text: "Alternate 5 back blows and 5 abdominal thrusts until the object is cleared or the person loses consciousness.",
      },
      {
        text: "If the person becomes unconscious, lower them carefully to the ground and begin CPR. Each time you open the airway to give a breath, look for the object and remove it if visible.",
      },
    ],
    callIf:
      "Call 112 if the object is not cleared after several cycles of back blows and abdominal thrusts, or if the person loses consciousness.",
  },
  {
    id: "head-injury",
    title: "Head Injury / Concussion",
    summary:
      "Keep them still and awake. Watch for danger signs. Do not give aspirin or ibuprofen.",
    emoji: "🤕",
    steps: [
      {
        text: "Keep the person as still as possible — do NOT move them if a spinal injury is possible (fall from height, vehicle collision at speed).",
      },
      {
        text: "If conscious, keep them awake and talking. Ask simple questions (name, date, where they are) to monitor alertness.",
      },
      {
        text: "Apply gentle pressure to any scalp wound with a clean cloth to control bleeding.",
        warning:
          "Do NOT apply firm pressure if you suspect a skull fracture (visible deformity, bruising behind the ears, clear fluid from nose or ears). Instead, cover loosely.",
      },
      {
        text: "Do NOT give aspirin or ibuprofen for a head injury.",
        warning:
          "Aspirin and ibuprofen thin the blood and can worsen internal bleeding in a head injury. Paracetamol (acetaminophen) is safer if pain relief is needed.",
      },
      {
        text: "Do NOT allow the person to 'walk it off', drive, or return to any activity — even a mild concussion requires rest and medical evaluation.",
      },
      {
        text: "Watch continuously for danger signs: vomiting more than once, seizures, unequal pupils, worsening headache, confusion, slurred speech, or loss of consciousness.",
      },
    ],
    callIf:
      "Call 112 immediately if the person loses consciousness at any point, vomits more than once, has a seizure, shows unequal pupils, was knocked out, or was in a high-speed vehicle accident.",
  },
  {
    id: "electric-shock",
    title: "Electric Shock",
    summary:
      "Do NOT touch the person until the power is off. Your safety comes first.",
    emoji: "⚡",
    steps: [
      {
        text: "Do NOT touch the person if they are still in contact with the electrical source.",
        warning:
          "Touching a person who is still connected to live electricity will electrocute you. This is the most common cause of bystander death in electric shock incidents.",
      },
      {
        text: "Turn off the power at the mains switch or circuit breaker immediately. If you cannot reach the switch, use a dry, non-conductive object (wooden stick, dry rope, plastic chair) to push the power source away from the person.",
      },
      {
        text: "Only approach and touch the person once you are absolutely certain the power is off.",
      },
      {
        text: "Call 112 immediately.",
      },
      {
        text: "Check for breathing and pulse. If the person is unresponsive and not breathing, begin CPR immediately (see CPR scenario).",
      },
      {
        text: "Cover any visible burns with a clean, dry dressing. Do NOT use wet cloth on electrical burns.",
      },
      {
        text: "Keep the person still and warm. Do NOT give food or water. Stay with them until emergency services arrive.",
      },
    ],
    callIf:
      "Call 112 immediately for any electric shock. Even if the person appears uninjured, internal burns and life-threatening heart arrhythmias can develop — all electric shock victims need urgent hospital evaluation.",
  },
];

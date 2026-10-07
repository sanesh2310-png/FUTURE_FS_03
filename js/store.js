// Cart, orders and loyalty points, saved in the visitor's browser (localStorage).
(function () {
  const KEY = 'brewbloom_v1';
  const blank = () => ({ customer: null, orders: [], cart: [] });
  const listeners = [];
  let s;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
  s = Object.assign(blank(), s || {});
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable */ }
    listeners.forEach((f) => f());
  };
  const subtotal = () => s.cart.reduce((a, i) => a + i.price * i.qty, 0);
  const L = () => window.CAFE.loyalty;

  window.Store = {
    get: () => s,
    on: (f) => listeners.push(f),
    count: () => s.cart.reduce((a, i) => a + i.qty, 0),
    subtotal,
    addToCart(item, qty = 1) {
      const f = s.cart.find((c) => c.key === item.key);
      if (f) f.qty += qty; else s.cart.push({ key: item.key, name: item.name, desc: item.desc || '', price: item.price, qty });
      save();
    },
    setQty(key, d) {
      const f = s.cart.find((c) => c.key === key);
      if (!f) return;
      f.qty += d;
      if (f.qty <= 0) s.cart = s.cart.filter((c) => c.key !== key);
      save();
    },
    join(name, phone) {
      s.customer = { name, phone, joined: new Date().toISOString(), points: L().welcomeBonus, lifetime: L().welcomeBonus };
      save();
    },
    leave() { s.customer = null; s.orders = []; save(); },
    tier(life) {
      const T = L().tiers;
      let cur = T[0], next = T[1] || null;
      T.forEach((t, i) => { if (life >= t[1]) { cur = t; next = T[i + 1] || null; } });
      return { name: cur[0], next: next ? { name: next[0], min: next[1] } : null };
    },
    placeOrder({ name, phone, type, note, redeem }) {
      const sub = subtotal();
      if (!sub) throw new Error('Your cart is empty.');
      let c = s.customer;
      if (!c) c = s.customer = { name, phone, joined: new Date().toISOString(), points: L().welcomeBonus, lifetime: L().welcomeBonus };
      else { c.name = name; c.phone = phone; }
      let discount = 0;
      if (redeem && c.points >= L().redeemPoints) { discount = Math.min(L().redeemValue, sub); c.points -= L().redeemPoints; }
      const total = sub - discount;
      const earned = Math.floor(total / L().earnEvery);
      c.points += earned; c.lifetime += earned;
      const order = {
        id: 'BB-' + Math.floor(1000 + Math.random() * 9000), date: new Date().toISOString(),
        items: s.cart.map((i) => ({ ...i })), subtotal: sub, discount, total, earned, type, note, name, phone,
      };
      s.orders.unshift(order);
      s.orders = s.orders.slice(0, 30);
      s.cart = [];
      save();
      return order;
    },
  };
})();

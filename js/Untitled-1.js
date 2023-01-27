/*! For license information please see klondike.js.LICENSE.txt */
!(function () {
    var e = {
            9745: function (e, t, a) {
                'use strict';
                a.r(t);
                var o = a(7344);
                let n = {
                    originalCount: 0,
                    originalCollection: {},
                    originalCardCounts: {},
                    emailSent: !1,
                    snapshot: !1,
                    previousSnapshot: !1,
                    getCardCounts: function (e) {
                        return e.flat(1 / 0).reduce(function (e, t) {
                            return void 0 === e[t.name] && (e[t.name] = 0), e[t.name]++, e;
                        }, {});
                    },
                    compareCardCounts: function (e, t) {
                        let a = n.getCardCounts(t);
                        return Object.keys(e).reduce(function (t, o) {
                            return e[o] != a[o] && (t[o] = e[o] - (a[o] || 0)), t;
                        }, {});
                    },
                    setOriginalCollection: function (e) {
                        (n.originalCardCounts = n.getCardCounts(e)),
                            (n.originalCollection = e),
                            (n.originalCount = n.countCollection(n.originalCollection));
                    },
                    setSnapshot: function () {
                        n.snapshot = { float: o.default.float };
                        for (let e = 0; e < o.default.allAreas.length; e++)
                            n.snapshot[o.default.allAreas[e].name] = o.default.allAreas[e].piles;
                    },
                    addPayload: function (e) {
                        for (let t in e) n.snapshot[t] = e[t];
                    },
                    stringifyCardArray: function (e) {
                        return e.map(function (e) {
                            return e.name;
                        });
                    },
                    moves: [],
                    logMove: function (e) {
                        if (!o.default.isReplay && (n.moves.push(e), o.default.storageKey))
                            try {
                                localStorage.setItem(o.default.storageKey, JSON.stringify(n.moves));
                            } catch (e) {}
                    },
                    countCollection: function (e) {
                        return e.flat(1 / 0).length;
                    },
                    verifyAction: function (e, t) {
                        t = t || '';
                        let a = 0;
                        for (let e = 0; e < o.default.allAreas.length; e++)
                            a += n.countCollection(o.default.allAreas[e].piles);
                        n.originalCount > 0 && (a != n.originalCount || o.default.float.length > 0)
                            ? n.emailSent ||
                              ((n.snapshot.count = a),
                              (n.snapshot.type = e),
                              (n.snapshot.failingMove = t),
                              (n.snapshot.originalCount = n.originalCount),
                              (n.snapshot.windowWidth = window.innerWidth),
                              (n.snapshot.windowHeight = window.innerHeight),
                              (n.snapshot.userAgent = window.navigator.userAgent),
                              (n.snapshot.float = n.stringifyCardArray(o.default.float)),
                              (n.snapshot.seed = seed),
                              (n.snapshot.missingCards = n.compareCardCounts(
                                  n.originalCardCounts,
                                  o.default.getAllCards()
                              )),
                              (n.snapshot.zzpreviousSnapshot = n.previousSnapshot),
                              n.sendEmail(n.snapshot),
                              (n.emailSent = !0))
                            : (n.previousSnapshot = n.snapshot);
                    },
                    sendEmail: function (e) {
                        try {
                            const t = (function () {
                                if (!window.consoleErrors) return [];
                                try {
                                    return window.consoleErrors.filter(function (e) {
                                        return e[0].indexOf('javascripts/dist') > -1;
                                    });
                                } catch (e) {
                                    return ['Error parsing errors'];
                                }
                            })();
                            $.post(
                                '/debug',
                                {
                                    payload: {
                                        missingCards: n.snapshot.missingCards,
                                        FailingMove: n.snapshot.failingMove,
                                        count: e.count,
                                        seed: e.seed,
                                        moves: n.moves,
                                        float: n.snapshot.float,
                                        moveCount: n.moves.length,
                                        moveType: n.snapshot.type,
                                        errors: t,
                                    },
                                },
                                function () {
                                    n.emailSent = !0;
                                }
                            );
                        } catch (e) {
                            recordError(e);
                        }
                    },
                };
                Array.prototype.flat ||
                    (Array.prototype.flat = function (e) {
                        return (
                            void 0 === e && (e = 1),
                            (function e(t, a) {
                                return a < 1
                                    ? t.slice()
                                    : t.reduce(function (t, o) {
                                          return t.concat(Array.isArray(o) ? e(o, a - 1) : o);
                                      }, []);
                            })(this, e)
                        );
                    }),
                    (t.default = n);
            },
            2924: function (e, t, a) {
                'use strict';
                var o = a(7344),
                    n = a(7176),
                    i = a.n(n),
                    r = a(5213),
                    l = a.n(r),
                    s = a(1022);
                const d = {};
                let f = {
                    shuffleFromSavedDeck: function (e) {
                        return Object.keys(e).reduce(function (t, a) {
                            return (
                                (t[a] = e[a].map(function (e) {
                                    return e.map(function (e) {
                                        const t = stock.findIndex(function (t) {
                                            return t.name === e.name;
                                        });
                                        return stock.slice(t, t + 1)[0];
                                    });
                                })),
                                t
                            );
                        }, {});
                    },
                    shuffle: function (e) {
                        if (e) {
                            const t = d[e];
                            if (t) return f.shuffleFromSavedDeck(t);
                        }
                        let t = Math.floor(stock.length / 52) * Math.floor(stock.length / 52);
                        for (let e = 0; e < t; e++)
                            SeededShuffle.shuffle(stock, seed),
                                SeededShuffle.shuffle(
                                    stock,
                                    seed.split('').reverse().join('').toLowerCase()
                                ),
                                SeededShuffle.shuffle(
                                    stock,
                                    seed.split('').reverse().join('').substr(0, 10).toUpperCase()
                                );
                        return (
                            'undefined' != typeof cardCount &&
                                (cardCount += ' then ' + stock.length),
                            {}
                        );
                    },
                    deal: function (e, t) {
                        let a = 20;
                        if (((0, s.isMobile)() && (a = 1), void 0 !== t)) {
                            for (let o = 0; o < t.length; o++)
                                for (let n = 0; n < t[o].length; n++)
                                    0 != t[o][n] &&
                                        (t[o][n].position = {
                                            frame: 0,
                                            maxFrames: a,
                                            x: 1e3,
                                            y: 3e3,
                                            xMin: 1e3,
                                            xMax: i().getXOffset(e, o),
                                            yMin: 3e3,
                                            yMax:
                                                i().getYOffset(e, n) +
                                                i().setYOffset(e, n * e.cardYOffset[o]),
                                        });
                            return f.animateDeal(e, t);
                        }
                        if (void 0 === e.legacyDistribution) {
                            for (let t = 0; t < e.piles.length; t++)
                                for (let n = 0; n < e.distribution[t]; n++) {
                                    let r = stock.pop();
                                    (r.position = {
                                        frame: 0,
                                        maxFrames: a,
                                        x: 1e3,
                                        y: 3e3,
                                        xMin: 1e3,
                                        xMax: i().getXOffset(e, t),
                                        yMin: 3e3,
                                        yMax:
                                            i().getYOffset(e, n) +
                                            i().setYOffset(e, n * e.cardYOffset[t]),
                                    }),
                                        o.default.float.push(r);
                                }
                            f.animateDeal(e);
                        } else {
                            for (let t = 0; t < e.legacyDistribution.length; t++)
                                for (let n = 0; n < e.legacyDistribution[t].length; n++) {
                                    if (0 == e.legacyDistribution[t][n]) continue;
                                    let r = stock.pop();
                                    (r.position = {
                                        frame: 0,
                                        maxFrames: a,
                                        x: 1e3,
                                        y: 3e3,
                                        xMin: 1e3,
                                        xMax: i().getXOffset(e, t),
                                        yMin: 3e3,
                                        yMax:
                                            i().getYOffset(e, n) +
                                            i().setYOffset(e, n * e.cardYOffset[t]),
                                    }),
                                        o.default.float.push(r);
                                }
                            f.animateDeal(e);
                        }
                    },
                };
                f.redeal,
                    (f.setRedealFn = function (e) {
                        f.redeal = e;
                    }),
                    f.refillStock,
                    (f.setRefillStockFn = function (e) {
                        f.refillStock = e;
                    }),
                    (f.animateDeal = function (e, t) {
                        if ((l().lock('animateDeal'), t))
                            return new Promise(function (a) {
                                l().lock(`animateDeal ${e.name}`);
                                let n = gsap.timeline({
                                    onStart: function () {},
                                    onComplete: function () {
                                        i().drawGame(),
                                            l().unlock('animateDeal'),
                                            l().unlock(`animateDeal ${e.name}`),
                                            a();
                                    },
                                });
                                for (let a = 0; a < t.length; a++)
                                    for (let r = 0; r < t[a].length; r++) {
                                        const l = t[a][r];
                                        if (!l) continue;
                                        let d = 0.2,
                                            f = 0;
                                        (0, s.isMobile)() && ((d = 0), (f = 0)),
                                            n.to(
                                                l.position,
                                                {
                                                    duration: o.default.getDeltaRatioDuration(d),
                                                    ease: 'sine.inOut',
                                                    rotation: l.position.rotationMax,
                                                    onStart: function () {
                                                        audio.cardFlip();
                                                    },
                                                    onUpdate: function () {
                                                        i().drawGame();
                                                    },
                                                    onComplete: function () {
                                                        e.piles[a][r] = l;
                                                    },
                                                },
                                                f
                                            );
                                    }
                            });
                        let a = 0 == o.default.float.length;
                        for (let e = 0; e < o.default.float.length; e++)
                            o.default.float[e].position.frame !=
                            o.default.float[e].position.maxFrames - 1
                                ? ((a = !1),
                                  (o.default.float[e].position.x =
                                      o.default.float[e].position.x +
                                      (o.default.float[e].position.xMax -
                                          o.default.float[e].position.xMin) /
                                          o.default.float[e].position.maxFrames),
                                  (o.default.float[e].position.y =
                                      o.default.float[e].position.y +
                                      (o.default.float[e].position.yMax -
                                          o.default.float[e].position.yMin) /
                                          o.default.float[e].position.maxFrames),
                                  (o.default.float[e].position.frame =
                                      o.default.float[e].position.frame + 1))
                                : (a = !0);
                        if ((i().drawGame(), a)) {
                            if (void 0 !== e.legacyDistribution) {
                                for (let t = 0; t < e.piles.length; t++)
                                    for (let a = t; a < e.piles.length; a++)
                                        e.piles[a].push(o.default.float.shift());
                                return void i().turnCardsUp('deal');
                            }
                            for (let t = 0; t < e.piles.length; t++)
                                for (let a = 0; a < e.distribution[t]; a++) {
                                    const a = o.default.float.shift();
                                    e.piles[t].push(a);
                                }
                            i().turnCardsUp('deal');
                        } else window.requestAnimationFrame(f.animateDeal.bind(null, e, null));
                    }),
                    (t.Z = f);
            },
            8021: function (e, t, a) {
                'use strict';
                a.r(t);
                var o = a(7344),
                    n = a(8027),
                    i = a.n(n),
                    r = a(7176),
                    l = a.n(r),
                    s = a(5213),
                    d = a.n(s),
                    f = a(1022);
                let u = !1,
                    c = {
                        hintsGiven: 0,
                        priorities: {},
                        flashMessage: '',
                        setPriorities: function (e) {
                            c.priorities = e;
                        },
                        setFlashMessage: function (e) {
                            c.flashMessage = e;
                        },
                        getFlashMessage: function () {
                            return c.flashMessage;
                        },
                        clearHighlightCard: function () {
                            c.highlightMoveName = '';
                        },
                        highlightMoveName: '',
                        highlightCard: function (e) {
                            return c.highlightMoveName == e;
                        },
                        wasAlreadyMoved: function (e) {
                            for (let t = 0; t < o.default.previousMoves.length; t++)
                                if (o.default.previousMoves[t].card.name == e.card.name) return 1;
                            return -1;
                        },
                        getPriority: function (e, t) {
                            let a = e + '_' + t;
                            return void 0 === c.priorities[a] ? -1 : c.priorities[a];
                        },
                        hasSameParent: function (e, t) {
                            const a = e.card;
                            if (0 == t.position) return !1;
                            let o = t.area.piles[t.pile][t.position - 1];
                            return (
                                t.area.name === e.area.name &&
                                a.number == o.number &&
                                1 == o.turnedup
                            );
                        },
                        getExplanation: function (e, t) {
                            let a = '',
                                o = '';
                            if (void 0 === e || e.priority < 0)
                                (a =
                                    'There are no available moves so the only move is to turn over a new card.'),
                                    (o =
                                        'The turned up card from the stockpile can be used to help build sequences.  If you have flipped through all of the cards in the stockpile, click to refill it.');
                            else {
                                (a += `Move: ${(0, f.convertCardToSymbolText)(
                                    e.card.name
                                )} from the ${e.area.name}`),
                                    e.target.card
                                        ? (a += ` on top of ${(0, f.convertCardToSymbolText)(
                                              e.target.card.name
                                          )} on the ${e.target.area.name}.`)
                                        : (a += ` to the ${e.target.area.name}.`),
                                    t.length > 1
                                        ? (a += `\n This is the best move from among ${t.length} available moves.`)
                                        : (a += '\n This is the best and only move available.');
                                let n = e.canDrag.concat(e.canDrop);
                                (n = n.reduce(function (e, t) {
                                    return (
                                        e.find(function (e) {
                                            return e.rule == t.rule;
                                        }) || e.push(t),
                                        e
                                    );
                                }, [])),
                                    (n = n.reduce(function (t, a) {
                                        return a.explain && t.push(a.explain(e)), t;
                                    }, [])),
                                    (n = n
                                        .map(function (e) {
                                            return `<div class="rules-explanation">${e}</div>`;
                                        })
                                        .join('')),
                                    (o += n);
                            }
                            return { text: a, rules: o };
                        },
                        flashExplanation: function (e) {
                            let t = {};
                            try {
                                t = JSON.parse(localStorage.getItem('solitaire:settings')) || {};
                            } catch (e) {
                                t = {};
                            }
                            t.skipExplanation ||
                                ($('#hint-explanation-modal-text').html(e.text),
                                $('#hint-explanation-modal-rules').html(e.rules),
                                $('#hint-explanation-modal').show());
                        },
                        initExplanations: function (e) {
                            (c.shouldShowExplanation = !0),
                                (c.dealFn = e),
                                $(function () {
                                    let e = {};
                                    try {
                                        e =
                                            JSON.parse(
                                                localStorage.getItem('solitaire:settings')
                                            ) || {};
                                    } catch (t) {
                                        e = {};
                                    }
                                    e.skipExplanation
                                        ? $('#hint-explanations-enable').show()
                                        : $('#hint-explanations-enable').hide(),
                                        $('#hint-explanation-modal-accept').on(
                                            'click',
                                            function () {
                                                $('#hint-explanation-modal').hide();
                                            }
                                        ),
                                        $('#hint-explanation-modal-decline').on(
                                            'click',
                                            function () {
                                                (e.skipExplanation = !0),
                                                    localStorage.setItem(
                                                        'solitaire:settings',
                                                        JSON.stringify(e)
                                                    ),
                                                    $('#hint-explanation-modal').hide(),
                                                    $('#hint-explanations-enable').show();
                                            }
                                        ),
                                        $('#hint-explanations-enable').on('click', function () {
                                            (e.skipExplanation = !1),
                                                localStorage.setItem(
                                                    'solitaire:settings',
                                                    JSON.stringify(e)
                                                ),
                                                $('#hint-explanations-enable').hide();
                                        }),
                                        $(document).on('click', function (e) {
                                            const t = $(e.target).attr('id');
                                            if (
                                                'hintBtn' === t ||
                                                'hint-explanation-modal-expand' === t
                                            )
                                                return !0;
                                            $('#hint-explanation-modal').hide();
                                        });
                                });
                        },
                        findMoves: function (e) {
                            const t =
                                'klondike-turn-1' == nameSlug || 'klondike-turn-3' == nameSlug;
                            let a = [];
                            for (let n = 0; n < o.default.allAreas.length; n++)
                                for (let r = 0; r < o.default.allAreas[n].piles.length; r++)
                                    for (
                                        let l = 0;
                                        l < o.default.allAreas[n].piles[r].length;
                                        l++
                                    ) {
                                        let s = o.default.allAreas[n].piles[r][l];
                                        if (void 0 === s) continue;
                                        const d = {
                                            area: o.default.allAreas[n],
                                            card: s,
                                            pile: r,
                                            position: l,
                                        };
                                        o.default.fromSet = d;
                                        const f = i().can('drag', o.default.fromSet, d);
                                        if (f)
                                            for (let r = 0; r < o.default.allAreas.length; r++)
                                                for (
                                                    let l = 0;
                                                    l < o.default.allAreas[r].piles.length;
                                                    l++
                                                )
                                                    if (
                                                        0 == o.default.allAreas[r].piles[l].length
                                                    ) {
                                                        let s = -1,
                                                            d = !1,
                                                            u = {
                                                                area: o.default.allAreas[r],
                                                                card: d,
                                                                pile: l,
                                                                position: s,
                                                            };
                                                        const p = i().can(
                                                            'drop',
                                                            o.default.fromSet,
                                                            u
                                                        );
                                                        if (p) {
                                                            if (
                                                                t &&
                                                                0 == o.default.fromSet.position &&
                                                                o.default.fromSet.area.name ==
                                                                    u.area.name
                                                            )
                                                                continue;
                                                            let i = {
                                                                card: o.default.fromSet.card,
                                                                priority: c.getPriority(
                                                                    o.default.allAreas[n].name,
                                                                    o.default.allAreas[r].name
                                                                ),
                                                                pile: o.default.fromSet.pile,
                                                                position:
                                                                    o.default.fromSet.position,
                                                                pilePosition:
                                                                    o.default.fromSet.pile +
                                                                    '_' +
                                                                    o.default.fromSet.position,
                                                                area: o.default.fromSet.area,
                                                                target: u,
                                                                canDrag: f,
                                                                canDrop: p,
                                                                isUnavailable: e,
                                                            };
                                                            (i.previous = c.wasAlreadyMoved(i)),
                                                                a.push(i);
                                                        }
                                                    } else
                                                        for (
                                                            let t = 0;
                                                            t <
                                                            o.default.allAreas[r].piles[l].length;
                                                            t++
                                                        ) {
                                                            let s =
                                                                    o.default.allAreas[r].piles[l][
                                                                        t
                                                                    ],
                                                                d = {
                                                                    area: o.default.allAreas[r],
                                                                    card: s,
                                                                    pile: l,
                                                                    position: t,
                                                                };
                                                            const u = i().can(
                                                                'drop',
                                                                o.default.fromSet,
                                                                d
                                                            );
                                                            if (u) {
                                                                let t = {
                                                                    card: o.default.fromSet.card,
                                                                    priority: c.getPriority(
                                                                        o.default.allAreas[n].name,
                                                                        o.default.allAreas[r].name
                                                                    ),
                                                                    pile: o.default.fromSet.pile,
                                                                    position:
                                                                        o.default.fromSet.position,
                                                                    pilePosition:
                                                                        o.default.fromSet.pile +
                                                                        '_' +
                                                                        o.default.fromSet.position,
                                                                    area: o.default.fromSet.area,
                                                                    target: d,
                                                                    canDrag: f,
                                                                    canDrop: u,
                                                                    isUnavailable: e,
                                                                };
                                                                c.hasSameParent(
                                                                    d,
                                                                    o.default.fromSet
                                                                ) ||
                                                                    ((t.previous =
                                                                        c.wasAlreadyMoved(t)),
                                                                    a.push(t));
                                                            }
                                                        }
                                    }
                            return a;
                        },
                        findAllMoves: function () {
                            if ('klondike-turn-1' != nameSlug && 'klondike-turn-3' != nameSlug)
                                return c.findMoves();
                            d().lock('hint');
                            let e = [];
                            const t = o.default.allAreas.find(function (e) {
                                    return 'stock' === e.name;
                                }),
                                a = o.default.allAreas.find(function (e) {
                                    return 'waste' === e.name;
                                }),
                                n = t.piles[0].slice(0),
                                i = a.piles[0].slice(0),
                                r = [],
                                l = [t.piles[0].length, a.piles[0].length].join('_');
                            let s = l,
                                f = 0;
                            for (; r.indexOf(s) < 0 && f < 100; ) {
                                f++;
                                const o = l !== s,
                                    n = c.findMoves(o);
                                if (((e = e.concat(n)), r.push(s), 0 === t.piles[0].length))
                                    (t.piles[0] = t.piles[0].concat(
                                        a.piles[0].splice(0).reverse()
                                    )),
                                        t.piles[0].forEach(function (e) {
                                            e.turnedup = !1;
                                        });
                                else {
                                    const e = t.piles[0].splice(-numTurns).reverse();
                                    e.forEach(function (e) {
                                        e.turnedup = 1;
                                    }),
                                        (a.piles[0] = a.piles[0].concat(e));
                                }
                                s = [t.piles[0].length, a.piles[0].length].join('_');
                            }
                            return (
                                (t.piles[0] = n),
                                t.piles[0].forEach(function (e) {
                                    e.turnedup = !1;
                                }),
                                (a.piles[0] = i),
                                a.piles[0].forEach(function (e) {
                                    e.turnedup = 1;
                                }),
                                d().unlock('hint'),
                                e
                            );
                        },
                        showHint: function (e, t) {
                            if (d().isLocked()) return;
                            if (((t = t || c.findAllMoves()), c.checkNoHints(t))) return;
                            (t = t.reduce(function (e, t) {
                                return (
                                    t.isUnavailable ||
                                        e.find(function (e) {
                                            return (
                                                t.card.name == e.card.name &&
                                                'foundations' === t.target.area.name &&
                                                'foundations' === e.target.area.name
                                            );
                                        }) ||
                                        e.push(t),
                                    e
                                );
                            }, [])).sort(function (e, t) {
                                return t.priority - e.priority;
                            });
                            let a,
                                n = t[0];
                            if (c.shouldShowExplanation) {
                                const e = c.getExplanation(n, t);
                                c.flashExplanation(e);
                            }
                            if (void 0 === n || n.priority < 0) {
                                c.shouldShowExplanation ||
                                    ((o.default.flashMessage = c.getFlashMessage()),
                                    i().showFlashMessage('find good move'));
                                try {
                                    const e = o.default.allAreas.find(function (e) {
                                            return 'stock' === e.name;
                                        }),
                                        t = o.default.allAreas.find(function (e) {
                                            return 'waste' === e.name;
                                        }),
                                        n = e.piles[0].length - 1,
                                        i = null == e ? void 0 : e.piles[0].slice(n)[0],
                                        r = null == t ? void 0 : t.piles[0].slice(-1)[0];
                                    i
                                        ? c.shouldShowExplanation && c.dealFn
                                            ? c.dealFn()
                                            : ((a = [e.name, i.name, 0, n].join('_')),
                                              d().animateStockCard({
                                                  area: e,
                                                  card: i,
                                                  pile: 0,
                                                  position: 0,
                                              }))
                                        : r &&
                                          d().animateStockCard({
                                              area: t,
                                              card: r,
                                              pile: 0,
                                              position: 0,
                                              reverseDirection: !0,
                                          });
                                } catch (e) {
                                    recordError(e);
                                }
                            } else
                                (a = [n.area.name, n.card.name, n.pilePosition].join('_')),
                                    o.default.previousMoves.push(n),
                                    e ? (d().setFromSet(n), d().click(n)) : d().animateClick(n);
                            c.highlightMoveName !== a && c.hintsGiven++,
                                (c.highlightMoveName = a),
                                l().drawGame();
                        },
                        checkNoHints: function (e) {
                            if (d().isLocked()) return;
                            if (u) return;
                            const t =
                                    'klondike-turn-1' == nameSlug || 'klondike-turn-3' == nameSlug,
                                a =
                                    [
                                        'spider-one-suit',
                                        'spider-two-suits',
                                        'spider-four-suits',
                                    ].indexOf(nameSlug) >= 0,
                                n = 'freecell' === nameSlug,
                                i = o.default.allAreas.find(function (e) {
                                    return 'stock' === e.name;
                                }),
                                r = (e = e || c.findAllMoves()).filter(function (e) {
                                    return 'foundations' !== e.area.name;
                                }),
                                l = (t || n) && 0 === r.length,
                                s = a && i && 0 === i.piles[0].length && 0 === r.length;
                            return (
                                (l || s) &&
                                    (gtag('event', 'no-hints-found', {
                                        event_category: 'hints',
                                        event_label: nameSlug,
                                        value: 1,
                                    }),
                                    $('#new-game-modal').modal('show'),
                                    (u = !0)),
                                l || s
                            );
                        },
                        initIdleHint: function (e) {
                            (0, f.onIdle)(e, c.showHint);
                        },
                    };
                t.default = c;
            },
            6549: function (e, t, a) {
                'use strict';
                a.r(t), a(1022);
                let o = { initCalled: {}, label: '' };
                const n = function (e, t) {
                    'function' == typeof e
                        ? e(t)
                        : setTimeout(function () {
                              window.location.assign(e);
                          }, 200);
                };
                (o.setLabel = function (e) {
                    o.label = String(e);
                }),
                    (o.callLngtd = function () {
                        let e =
                            arguments.length > 0 && void 0 !== arguments[0]
                                ? arguments[0]
                                : 'default';
                        if ('reward' === e || !o.initCalled[e]) {
                            o.initCalled[e] = !0;
                            try {
                                var t;
                                null === (t = window.lngtd) ||
                                    void 0 === t ||
                                    t.initInterstitial(e);
                            } catch (t) {
                                recordError(t, { method: 'callLngtd', adType: e });
                            }
                        }
                    }),
                    (o.loadMoment = function (e) {
                        if (
                            'undefined' == typeof adsbygoogle ||
                            !adsbygoogle.loaded ||
                            0 == adsbygoogle.push.length
                        )
                            return (
                                gtag('event', 'h5-no-load', {
                                    event_category: 'moments',
                                    event_label: o.label,
                                    value: 1,
                                }),
                                void n(e)
                            );
                        gtag('event', 'h5-load', {
                            event_category: 'moments',
                            event_label: o.label,
                            value: 1,
                        });
                        try {
                            let t = !1;
                            adBreak({
                                type: 'next',
                                name: 'nextGame',
                                beforeAd: function () {
                                    gtag('event', 'h5-fill', {
                                        event_category: 'moments',
                                        event_label: o.label,
                                        value: 1,
                                    }),
                                        (t = !0);
                                },
                                afterAd: function () {
                                    gtag('event', 'h5-fill-after', {
                                        event_category: 'moments',
                                        event_label: o.label,
                                        value: 1,
                                    });
                                },
                                adBreakDone: function (a) {
                                    if (t)
                                        return (
                                            gtag('event', 'h5-passthru', {
                                                event_category: 'moments',
                                                event_label: o.label,
                                                value: 1,
                                            }),
                                            void n(e)
                                        );
                                    gtag('event', 'h5-no-fill', {
                                        event_category: 'moments',
                                        event_label: o.label,
                                        value: 1,
                                    }),
                                        parseInt(('' + Date.now()).slice(-1)),
                                        n(e);
                                },
                            });
                        } catch (t) {
                            recordError(t, { method: 'loadMoment' }), n(e);
                        }
                    }),
                    (o.loadRewarded = function (e, t) {
                        if (
                            'undefined' == typeof adsbygoogle ||
                            !adsbygoogle.loaded ||
                            0 == adsbygoogle.push.length
                        )
                            return (
                                gtag('event', 'h5-no-load', {
                                    event_category: 'rewarded-video',
                                    event_label: o.label,
                                    value: 1,
                                }),
                                void n(e, !1)
                            );
                        gtag('event', 'h5-load', {
                            event_category: 'rewarded-video',
                            event_label: o.label,
                            value: 1,
                        });
                        try {
                            let a = !1,
                                i = !1;
                            adBreak({
                                type: 'reward',
                                name: 'rewarded',
                                beforeAd: function () {
                                    gtag('event', 'h5-fill', {
                                        event_category: 'rewarded-video',
                                        event_label: o.label,
                                        value: 1,
                                    }),
                                        (i = !0);
                                },
                                beforeReward: function (t) {
                                    gtag('event', 'beforeReward', {
                                        event_category: 'rewarded-video',
                                        event_label: o.label,
                                        value: 1,
                                    }),
                                        n(e, t);
                                },
                                adDismissed: function () {
                                    gtag('event', 'ad-dismissed', {
                                        event_category: 'rewarded-video',
                                        event_label: o.label,
                                        value: 1,
                                    });
                                },
                                adViewed: function () {
                                    gtag('event', 'ad-viewed', {
                                        event_category: 'rewarded-video',
                                        event_label: o.label,
                                        value: 1,
                                    }),
                                        (a = !0);
                                },
                                afterAd: function () {
                                    gtag('event', 'h5-fill-after', {
                                        event_category: 'rewarded-video',
                                        event_label: o.label,
                                        value: 1,
                                    });
                                },
                                adBreakDone: function (o) {
                                    return i
                                        ? a
                                            ? (gtag('event', 'h5-passthru', {
                                                  event_category: 'rewarded-video',
                                                  event_label: o.breakStatus,
                                                  value: 1,
                                              }),
                                              void n(t, !0))
                                            : void n(t, !1)
                                        : (gtag('event', 'h5-no-fill', {
                                              event_category: 'rewarded-video',
                                              event_label: o.breakStatus,
                                              value: 1,
                                          }),
                                          void n(e, !1));
                                },
                            });
                        } catch (e) {
                            n(t, !0);
                        }
                    }),
                    (o.loadLngtdRewarded = function (e, t) {
                        var a;
                        if (null === (a = window.lngtd) || void 0 === a || !a.triggerInterstitial)
                            return (
                                gtag('event', 'lngtd-no-load', {
                                    event_category: 'rewarded-video',
                                    event_label: 'lngtd',
                                    value: 1,
                                }),
                                o.loadRewarded(e, t)
                            );
                        gtag('event', 'h5-load', {
                            event_category: 'rewarded-video',
                            event_label: 'lngtd',
                            value: 1,
                        });
                        try {
                            var i;
                            let a = !1;
                            console.log('trigger LNGTD interstitial'),
                                null === (i = window.lngtd) ||
                                    void 0 === i ||
                                    i.triggerInterstitial(
                                        {
                                            type: 'reward',
                                            name: 'rewarded',
                                            minViewTime: 5e3,
                                            maxAdBreak: 12e4,
                                            rewardText: 'Hint in',
                                            rewardCloseWarningText: 'You will not get your hint.',
                                            beforeAd: function () {
                                                console.log('LNGTD beforeAd'),
                                                    gtag('event', 'h5-fill', {
                                                        event_category: 'rewarded-video',
                                                        event_label: 'lngtd',
                                                        value: 1,
                                                    }),
                                                    (a = !0);
                                            },
                                            adDismissed: function () {
                                                return (
                                                    console.log('LNGTD adDismissed'),
                                                    gtag('event', 'ad-dismissed', {
                                                        event_category: 'rewarded-video',
                                                        event_label: 'lngtd',
                                                        value: 1,
                                                    }),
                                                    n(t, !1)
                                                );
                                            },
                                            adBreakDone: function () {
                                                return (
                                                    console.log('LNGTD adBreakDone'),
                                                    a
                                                        ? (gtag('event', 'h5-passthru', {
                                                              event_category: 'rewarded-video',
                                                              event_label: 'lngtd',
                                                              value: 1,
                                                          }),
                                                          n(t, !0))
                                                        : (gtag('event', 'h5-no-fill', {
                                                              event_category: 'rewarded-video',
                                                              event_label: 'lngtd',
                                                              value: 1,
                                                          }),
                                                          o.loadRewarded(e, t))
                                                );
                                            },
                                        },
                                        'reward'
                                    );
                        } catch (e) {
                            n(t, !0);
                        }
                    }),
                    (o.lngtdMoments = function (e) {
                        var t;
                        if (null === (t = window.lngtd) || void 0 === t || !t.triggerInterstitial)
                            return (
                                gtag('event', 'lngtd-no-load', {
                                    event_category: 'lngtd-moments',
                                    event_label: 'lngtd',
                                    value: 1,
                                }),
                                void n(e)
                            );
                        gtag('event', 'lngtd-load', {
                            event_category: 'lngtd-moments',
                            event_label: 'lngtd',
                            value: 1,
                        });
                        let a = !1;
                        try {
                            lngtd.stopRefresh();
                        } catch (e) {
                            console.log('lngtd.stopRefresh() failed');
                        }
                        try {
                            window.lngtd.triggerInterstitial(
                                {
                                    type: 'interstitial',
                                    name: 'interstitial',
                                    minViewTime: 8e3,
                                    maxAdBreak: 4e4,
                                    beforeAd: function () {
                                        (a = !0),
                                            gtag('event', 'lngtd-fill', {
                                                event_category: 'lngtd-moments',
                                                event_label: 'lngtd',
                                                value: 1,
                                            });
                                    },
                                    adBreakDone: function (t) {
                                        if (
                                            (gtag('event', a ? 'lngtd-passthru' : 'lngtd-no-fill', {
                                                event_category: 'lngtd-moments',
                                                event_label: 'lngtd',
                                                value: 1,
                                            }),
                                            a)
                                        )
                                            return n(e);
                                        o.loadMoment(e);
                                    },
                                },
                                'interstitial_video'
                            );
                        } catch (t) {
                            return recordError(t, { method: 'lngtdMoment' }), n(e);
                        }
                    }),
                    (t.default = o);
            },
            9226: function (e, t, a) {
                'use strict';
                a.r(t),
                    a.d(t, {
                        default: function () {
                            return g;
                        },
                    });
                var o = a(7344),
                    n = a(2341),
                    i = a(3558),
                    r = a(6549),
                    l = a(1022);
                const s = [
                    {
                        image: '/images/trophies/wincounttrophies/Bronze/5.png',
                        name: 'Beginner',
                        winCount: 1,
                        color: 'Bronze',
                        text: '1 win',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Silver/5.png',
                        name: 'Beginner',
                        winCount: 2,
                        color: 'Silver',
                        text: '2 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Gold/5.png',
                        name: 'Beginner',
                        winCount: 5,
                        color: 'Gold',
                        text: '5 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/ruby/5.png',
                        name: 'Beginner',
                        winCount: 10,
                        color: 'Ruby',
                        text: '10 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/emerald/5.png',
                        name: 'Beginner',
                        winCount: 20,
                        color: 'Emerald',
                        text: '20 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/diamond/5.png',
                        name: 'Beginner',
                        winCount: 30,
                        color: 'Diamond',
                        text: '30 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Bronze/4.png',
                        name: 'Pro',
                        winCount: 50,
                        color: 'Bronze',
                        text: '50 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Silver/4.png',
                        name: 'Pro',
                        winCount: 75,
                        color: 'Silver',
                        text: '75 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Gold/4.png',
                        name: 'Pro',
                        winCount: 100,
                        color: 'Gold',
                        text: '100 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/ruby/4.png',
                        name: 'Pro',
                        winCount: 200,
                        color: 'Ruby',
                        text: '200 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/emerald/4.png',
                        name: 'Pro',
                        winCount: 300,
                        color: 'Emerald',
                        text: '300 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/diamond/4.png',
                        name: 'Pro',
                        winCount: 500,
                        color: 'Diamond',
                        text: '500 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Bronze/7.png',
                        name: 'Legend',
                        winCount: 750,
                        color: 'Bronze',
                        text: '750 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Silver/7.png',
                        name: 'Legend',
                        winCount: 1e3,
                        color: 'Silver',
                        text: '1000 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Gold/7.png',
                        name: 'Legend',
                        winCount: 1500,
                        color: 'Gold',
                        text: '1500 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/ruby/7.png',
                        name: 'Legend',
                        winCount: 2e3,
                        color: 'Ruby',
                        text: '2000 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/emerald/7.png',
                        name: 'Legend',
                        winCount: 2500,
                        color: 'Emerald',
                        text: '2500 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/diamond/7.png',
                        name: 'Legend',
                        winCount: 3e3,
                        color: 'Diamond',
                        text: '3000 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Bronze/8.png',
                        name: 'Master',
                        winCount: 3500,
                        color: 'Bronze',
                        text: '3500 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Silver/8.png',
                        name: 'Master',
                        winCount: 4e3,
                        color: 'Silver',
                        text: '4000 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/Gold/8.png',
                        name: 'Master',
                        winCount: 4500,
                        color: 'Gold',
                        text: '4500 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/ruby/8.png',
                        name: 'Master',
                        winCount: 5e3,
                        color: 'Ruby',
                        text: '5000 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/emerald/8.png',
                        name: 'Master',
                        winCount: 5500,
                        color: 'Emerald',
                        text: '5500 wins',
                    },
                    {
                        image: '/images/trophies/wincounttrophies/diamond/8.png',
                        name: 'Master',
                        winCount: 6e3,
                        color: 'Diamond',
                        text: '6000 wins',
                    },
                ];
                function d(e) {
                    return s.reduce(function (t, a) {
                        return e >= a.winCount && t.push(a), t;
                    }, []);
                }
                var f = a(5213),
                    u = a.n(f);
                let c,
                    p = {};
                l.isLocalEnv && (window.score = p),
                    (p.seedSaved = !1),
                    (p.finalMoves = null),
                    (p.finalTime = null),
                    (p.copyText = function () {
                        navigator.clipboard.writeText(
                            'I won in ' +
                                p.finalTime[0] +
                                ' minutes and ' +
                                p.finalTime[1] +
                                ' seconds, in ' +
                                p.finalMoves +
                                ' moves. Can you beat me? Play here: https://solitaired.com' +
                                homeUrl +
                                '?seed=' +
                                seed
                        );
                    }),
                    (p.saveSeed = function () {
                        if (p.seedSaved) return;
                        (p.seedSaved = !0),
                            r.default.callLngtd('interstitial_video'),
                            i.default.stop();
                        let e = i.default.get(),
                            t = o.default.turns,
                            a = {
                                gameId: window.gameId,
                                seed: seed,
                                game: nameSlug,
                                turns: t,
                                time: e,
                            };
                        $.post('/seed/save', a),
                            $.post('/high-scores/update', a, function (e) {
                                (c = e.gameData), p.triggerHighScores();
                            }).fail(function () {
                                p.triggerHighScores();
                            }),
                            window.dispatchEvent(o.default.gameWonEvent);
                    }),
                    (p.triggerHighScores = function () {
                        if (!o.default.gameWon && !(0, l.isLocalEnv)() && !(0, l.isStagingEnv)())
                            return;
                        let e = i.default.get(),
                            t = o.default.turns;
                        (p.finalMoves = t),
                            (p.finalTime = e),
                            $.post(
                                '/high-scores/highscore2',
                                {
                                    seed: seed,
                                    time: e,
                                    moves: t,
                                    game: nameSlug,
                                    gameId: window.gameId,
                                    gotd: gameOfTheDay,
                                },
                                function (t) {
                                    var a;
                                    n.default.congrats(),
                                        $('#congrats .congrats-title').html(
                                            congratsMessage
                                                .replace('%%TIME%%', e)
                                                .replace(/%%TURNS%%/g, o.default.turns)
                                        ),
                                        $('#congrats').show(),
                                        $(
                                            '.highscore-body .table tbody, div.congrats-inner, div.congrats-bottom'
                                        ).html('');
                                    let i = 'Save';
                                    (0, l.isMobile)() && (i = 'Add name');
                                    let r = `<form class="form-inline save-username" style="display:block"><input type="text" class="form-control form-control-sm mr-2 congratsUsername d-none d-sm-inline" placeholder="Add your name" size="15" /><input type="button" data-label="congrats-save-username" class="btn btn-primary btn-sm saveUsername" value="${i}"></form>`,
                                        s = !1,
                                        f =
                                            (null === (a = t.data[t.data.length - 1]) ||
                                            void 0 === a
                                                ? void 0
                                                : a.score) || 0,
                                        c = 'userScore';
                                    0 == f.length &&
                                        ((f = t.data[t.data.length - 1].completion_time),
                                        (c = 'userSeconds'));
                                    let p = '',
                                        m = !1;
                                    t.showScore || $('#congrats .score-column').hide();
                                    for (let e = 0; e < t.data.length; e++) {
                                        let a,
                                            o = t.data[e];
                                        if (o.trophies) {
                                            const e = d(parseInt(o.trophies));
                                            let t;
                                            e.length > 0 && (t = e[e.length - 1]),
                                                (a = `<img class="score-username-trophy" src="${t.image}", height="16" data-toggle="tooltip" title="${t.text}" style="margin-right:5px;"></img>`);
                                        }
                                        if ('split' == o) {
                                            $('#congrats .table').append(
                                                '<tr><td colspan="4"><hr class="dotted-border"></td></tr>'
                                            );
                                            continue;
                                        }
                                        (p = ''),
                                            (o.gameId == window.gameId ||
                                                (o.user_id == t.userId &&
                                                    o.score == t.userScore)) &&
                                                ((p = 'light-yellow font-weight-bold'), (m = !0)),
                                            t.userId == o.user_id &&
                                                t.userId.toString().length < 11 &&
                                                o.score < t.userScore &&
                                                0 == p.length &&
                                                (s = !0);
                                        let n = o.username.split('@')[0];
                                        n.length > 25 && (n = n.substring(0, 22) + '...');
                                        let i = `<a target="_blank" href="/high-scores/user/${o.username}">`;
                                        a && (i += `${a}`),
                                            (i += `${n}</td>`),
                                            t.userId &&
                                                t.userId.toString().length > 11 &&
                                                o.gameId == window.gameId &&
                                                (i = r);
                                        let l = '';
                                        t.showScore &&
                                            (l = '<td class="text-right">' + o.score + '</td>'),
                                            $('#congrats .table').append(
                                                '<tr data-id="' +
                                                    o.gameId +
                                                    '" class="' +
                                                    p +
                                                    '"><td>' +
                                                    (o.rank + 1) +
                                                    '.</td><td class="text-left high-score-username">' +
                                                    i +
                                                    '</td><td class="text-right">' +
                                                    o.moves +
                                                    '</td><td class="text-right">' +
                                                    o.time +
                                                    '</td>' +
                                                    l +
                                                    '</tr>'
                                            ),
                                            a &&
                                                $('.score-username-trophy').tooltip({
                                                    boundary: 'window',
                                                });
                                    }
                                    m &&
                                        window.setTimeout(function () {
                                            var e, t;
                                            null ===
                                                (e = $('.highscore-body').find(
                                                    'tr.light-yellow.font-weight-bold'
                                                )) ||
                                                void 0 === e ||
                                                null === (t = e.get(0)) ||
                                                void 0 === t ||
                                                t.scrollIntoView({ block: 'nearest' });
                                        }, 50),
                                        $('.highscore-body .table').show(),
                                        (t[c] <= f || t.data.length < 20) &&
                                            m &&
                                            $('.congrats-inner').append(
                                                '<p class="mb-0 text-success">You scored #' +
                                                    t.rank +
                                                    ' of ' +
                                                    t.rankTotal +
                                                    '!</h3>'
                                            ),
                                        s &&
                                            $('#congrats .congrats-bottom').prepend(
                                                `<div class="small m-1 text-secondary">We only show your best score above. On this game, you scored ${t.userScore} (${t.userTime} time and ${t.userMoves} moves).</div>`
                                            );
                                    let g = Math.random(),
                                        h = homeUrl;
                                    g < 0.5 && (h = homeUrl + '?deal=winnable');
                                    const v =
                                        'klondike-turn-1' == nameSlug ||
                                        'klondike-turn-3' == nameSlug;
                                    let w =
                                        '<div class="mt-2 mb-2"><button class="btn btn-lg btn-success font-weight-bold mr-2 mt-1" data-link="' +
                                        h +
                                        '" data-label="new-game-congrats">Play Next Game</button>';
                                    v &&
                                        (w = `${w}\n          <button id="congrats-btn-replay" class="btn btn-outline-success btn-lg mr-2 mt-1" data-label="watch-replay" >\n            Watch Replay ▶\n          </button>`),
                                        (w = `${w}</div>`),
                                        $('#congrats .congrats-bottom').append(w);
                                    let y = '<div class="small mb-1">';
                                    (y +=
                                        '<button class="mt-1 mr-1 btn btn-outline-success btn-sm" data-link="' +
                                        homeUrl +
                                        '?deal=winnable" data-label="new-game-congrats-winnable">Play Guaranteed Winnable Game</button>'),
                                        (y +=
                                            '<button class="mr-1 mt-1  btn btn-outline-success btn-sm" data-label="new-game-congrats-same" data-link="' +
                                            homeUrl +
                                            '?seed=' +
                                            seed +
                                            '">Same game</button>'),
                                        (y +=
                                            '<button class="mr-1 mt-1  btn btn-outline-success btn-sm" data-label="new-game-congrats-gotd" data-link="?game-of-the-day=true">Game of the Day</button>'),
                                        (y += '</div>'),
                                        $('#congrats .congrats-bottom').append(y),
                                        v &&
                                            $('#congrats-btn-replay').on('click', function () {
                                                o.default.isReplay ||
                                                    (gtag('event', 'click', {
                                                        event_category: nameSlug,
                                                        event_label: 'replay',
                                                        value: 1,
                                                    }),
                                                    $('#congrats').hasClass('minimizeCongrats') ||
                                                        $('#closeCongrats').click(),
                                                    o.default.waterfallRunning &&
                                                        (o.default.waterfallRunning.kill(),
                                                        (o.default.waterfallRunning = !1),
                                                        window.cancelAnimationFrame(
                                                            o.default.animationFrameRunning
                                                        ),
                                                        u().unlock('waterfall')),
                                                    window.newGame && window.newGame(!0));
                                            }),
                                        'undefined' != typeof klondikeMultiplayer &&
                                            klondikeMultiplayer &&
                                            $('#congrats .congrats-bottom').html(
                                                '<p>You beat <strong>' +
                                                    playerTwoUsername +
                                                    '</strong>!</p><div class="mb-2"><button class="btn btn-lg btn-success font-weight-bold mb-3 mr-2" data-link="' +
                                                    homeUrl +
                                                    '" data-label="new-game-congrats">Play Multiplayer Again</button><button data-link="/" class="btn btn-lg btn-secondary font-weight-bold mb-3 mr-2">Play Single Player</button></div>'
                                            );
                                }
                            ),
                            $.post(
                                `/high-scores/stats-personal?extended=false&game=${nameSlug}`,
                                { gameData: c },
                                function (e) {
                                    $('#congrats .congrats-stats').html(''),
                                        $('#congrats .congrats-stats').append(e);
                                }
                            );
                    }),
                    $('body').on('click', '#shareScore', function () {
                        p.copyText(),
                            $(this).tooltip('show'),
                            window.setTimeout(function () {
                                $('#shareScore').tooltip('hide');
                            }, 2e3),
                            gtag('event', 'click', {
                                event_category: 'share',
                                event_label: 'copy',
                                value: 1,
                            });
                    }),
                    $('body').on('click', '#closeCongrats', function () {
                        $('#congrats').hasClass('minimizeCongrats')
                            ? $('#congrats').fadeOut(500, function () {
                                  $(
                                      '.congrats-title, .congrats-stats, .stats-jumbotron, .congrats-inner, .highscore-body'
                                  ).show(),
                                      $('#congrats').addClass('maximizeCongrats').fadeIn(),
                                      $('#congrats').removeClass('minimizeCongrats'),
                                      $('#closeCongrats').html('&times;');
                              })
                            : $('#congrats').fadeOut(500, function () {
                                  $(
                                      '.congrats-title, .congrats-stats, .stats-jumbotron, .congrats-inner, .highscore-body'
                                  ).hide(),
                                      $('#congrats').addClass('minimizeCongrats').fadeIn(),
                                      $('#congrats').removeClass('maximizeCongrats'),
                                      $('#closeCongrats').text('+');
                              });
                    });
                let m = !1;
                $('body').on('click', '[data-link]', function () {
                    let e = $(this).data('link');
                    m && (window.location.href = e),
                        setTimeout(function () {
                            m = !0;
                        }, 1e3),
                        r.default.lngtdMoments(e);
                }),
                    ((0, l.isLocalEnv)() || (0, l.isStagingEnv)()) && (window.score = p);
                var g = p;
            },
            6739: function (e, t, a) {
                'use strict';
                a.r(t);
                var o = a(7344);
                let n = {
                    updateTurn: function (e) {
                        null == e && (e = 1),
                            (o.default.turns = o.default.turns + e),
                            $('#turnCount').text(o.default.turns);
                    },
                    updateStockCount: function (e) {
                        (o.default.stockCount = e), $('#stockCount').text(o.default.stockCount);
                    },
                    updatePassthroughs: function (e) {
                        null == e && (e = 1),
                            (o.default.passthroughs = o.default.passthroughs + e),
                            $('#passthroughCount').text(o.default.passthroughs);
                    },
                    resetTurns: function (e) {
                        (o.default.turns = 0), $('#turnCount').text(0);
                    },
                };
                t.default = n;
            },
            5401: function (e, t, a) {
                'use strict';
                a.r(t);
                var o = a(7344),
                    n = a(7176),
                    i = a.n(n),
                    r = a(5213),
                    l = a.n(r),
                    s = a(2924);
                let d = {
                    undos: [],
                    redos: [],
                    undo: function () {
                        if (l().isLocked()) return !1;
                        if (0 == d.undos.length) return !1;
                        let e,
                            t = d.undos.pop();
                        if (void 0 !== t.type && 'deal' == t.type)
                            return s.Z.redeal(!0, !1, t), void d.addRedo(t);
                        if (void 0 !== t.type && 'refillStock' == t.type)
                            return s.Z.refillStock(!0, !1, t), void d.addRedo(t);
                        for (let a = 0; a < o.default.allAreas.length; a++)
                            o.default.allAreas[a].name == t.from.name &&
                                (e = {
                                    area: o.default.allAreas[a],
                                    card: !1,
                                    pile: t.from.pile,
                                    position: t.from.position - 1,
                                }),
                                o.default.allAreas[a].name == t.to.name &&
                                    (o.default.fromSet = {
                                        area: o.default.allAreas[a],
                                        card: !1,
                                        pile: t.to.pile,
                                        position: t.to.position + 1,
                                    });
                        void 0 !== t.from.flipPosition &&
                            ((o.default.fromSet.flipPosition = t.to.flipPosition),
                            (o.default.fromSet.rotation = t.to.flipTurnUpFrom),
                            (o.default.fromSet.rotationMax = t.to.flipTurnUpTo),
                            (o.default.fromSet.flipTurnUpFrom = t.to.flipTurnUpFrom),
                            (o.default.fromSet.flipTurnUpTo = t.to.flipTurnUpTo),
                            (e.flipPosition = t.from.flipPosition),
                            (e.rotation = t.from.flipTurnUpFrom),
                            (e.rotationMax = t.from.flipTurnUpTo),
                            (e.flipTurnUpFrom = t.from.flipTurnUpFrom),
                            (e.flipTurnUpTo = t.from.flipTurnUpTo)),
                            (o.default.float = o.default.fromSet.area.piles[
                                o.default.fromSet.pile
                            ].slice(o.default.fromSet.position));
                        for (let e = 0; e < o.default.float.length; e++)
                            (o.default.float[e].position.x = i().getXOffset(
                                o.default.fromSet.area,
                                o.default.fromSet.pile
                            )),
                                (o.default.float[e].position.y = i().getYOffset(
                                    o.default.fromSet.area,
                                    o.default.fromSet.position
                                )),
                                o.default.fromSet.area.collapse ||
                                    (o.default.float[e].position.y +=
                                        (o.default.fromSet.position + e) *
                                        o.default.fromSet.area.cardYOffset[o.default.fromSet.pile]);
                        t.triggerNextUndo && (e.triggerNextUndo = !0),
                            l().completeDrop({}, e, !0, !1),
                            d.addRedo(t);
                    },
                    redo: function () {
                        if (l().isLocked()) return !1;
                        if (0 == d.redos.length) return !1;
                        let e,
                            t = d.redos.pop();
                        if (void 0 !== t.type && 'deal' == t.type)
                            return s.Z.redeal(!1, !0, t), void d.addUndo(t);
                        if (void 0 !== t.type && 'refillStock' == t.type)
                            return s.Z.refillStock(!1, !0, t), void d.addUndo(t);
                        for (let a = 0; a < o.default.allAreas.length; a++)
                            o.default.allAreas[a].name == t.to.name &&
                                (e = {
                                    area: o.default.allAreas[a],
                                    card: !1,
                                    pile: t.to.pile,
                                    position: t.to.position,
                                }),
                                o.default.allAreas[a].name == t.from.name &&
                                    (o.default.fromSet = {
                                        area: o.default.allAreas[a],
                                        card: !1,
                                        pile: t.from.pile,
                                        position: t.from.position,
                                    });
                        o.default.float = o.default.fromSet.area.piles[
                            o.default.fromSet.pile
                        ].slice(o.default.fromSet.position);
                        for (let e = 0; e < o.default.float.length; e++)
                            (o.default.float[e].position.x = i().getXOffset(
                                o.default.fromSet.area,
                                o.default.fromSet.pile
                            )),
                                (o.default.float[e].position.y =
                                    i().getYOffset(
                                        o.default.fromSet.area,
                                        o.default.fromSet.position + e
                                    ) +
                                    (o.default.fromSet.position + e) *
                                        o.default.fromSet.area.cardYOffset[o.default.fromSet.pile]);
                        l().completeDrop({}, e, !1, !0), d.addUndo(t);
                    },
                    addUndo: function (e) {
                        d.undos.push(e);
                    },
                    addRedo: function (e) {
                        d.redos.push(e);
                    },
                    clearUndo: function () {
                        d.undos = [];
                    },
                    clearRedo: function () {
                        d.redos = [];
                    },
                };
                t.default = d;
            },
            8492: function (e, t, a) {
                var o = /^\s+|\s+$/g,
                    n = /^[-+]0x[0-9a-f]+$/i,
                    i = /^0b[01]+$/i,
                    r = /^0o[0-7]+$/i,
                    l = parseInt,
                    s = 'object' == typeof a.g && a.g && a.g.Object === Object && a.g,
                    d = 'object' == typeof self && self && self.Object === Object && self,
                    f = s || d || Function('return this')(),
                    u = Object.prototype.toString,
                    c = Math.max,
                    p = Math.min,
                    m = function () {
                        return f.Date.now();
                    };
                function g(e) {
                    var t = typeof e;
                    return !!e && ('object' == t || 'function' == t);
                }
                function h(e) {
                    if ('number' == typeof e) return e;
                    if (
                        (function (e) {
                            return (
                                'symbol' == typeof e ||
                                ((function (e) {
                                    return !!e && 'object' == typeof e;
                                })(e) &&
                                    '[object Symbol]' == u.call(e))
                            );
                        })(e)
                    )
                        return NaN;
                    if (g(e)) {
                        var t = 'function' == typeof e.valueOf ? e.valueOf() : e;
                        e = g(t) ? t + '' : t;
                    }
                    if ('string' != typeof e) return 0 === e ? e : +e;
                    e = e.replace(o, '');
                    var a = i.test(e);
                    return a || r.test(e) ? l(e.slice(2), a ? 2 : 8) : n.test(e) ? NaN : +e;
                }
                e.exports = function (e, t, a) {
                    var o,
                        n,
                        i,
                        r,
                        l,
                        s,
                        d = 0,
                        f = !1,
                        u = !1,
                        v = !0;
                    if ('function' != typeof e) throw new TypeError('Expected a function');
                    function w(t) {
                        var a = o,
                            i = n;
                        return (o = n = void 0), (d = t), (r = e.apply(i, a));
                    }
                    function y(e) {
                        return (d = e), (l = setTimeout(S, t)), f ? w(e) : r;
                    }
                    function b(e) {
                        var a = e - s;
                        return void 0 === s || a >= t || a < 0 || (u && e - d >= i);
                    }
                    function S() {
                        var e = m();
                        if (b(e)) return x(e);
                        l = setTimeout(
                            S,
                            (function (e) {
                                var a = t - (e - s);
                                return u ? p(a, i - (e - d)) : a;
                            })(e)
                        );
                    }
                    function x(e) {
                        return (l = void 0), v && o ? w(e) : ((o = n = void 0), r);
                    }
                    function k() {
                        var e = m(),
                            a = b(e);
                        if (((o = arguments), (n = this), (s = e), a)) {
                            if (void 0 === l) return y(s);
                            if (u) return (l = setTimeout(S, t)), w(s);
                        }
                        return void 0 === l && (l = setTimeout(S, t)), r;
                    }
                    return (
                        (t = h(t) || 0),
                        g(a) &&
                            ((f = !!a.leading),
                            (i = (u = 'maxWait' in a) ? c(h(a.maxWait) || 0, t) : i),
                            (v = 'trailing' in a ? !!a.trailing : v)),
                        (k.cancel = function () {
                            void 0 !== l && clearTimeout(l), (d = 0), (o = s = n = l = void 0);
                        }),
                        (k.flush = function () {
                            return void 0 === l ? r : x(m());
                        }),
                        k
                    );
                };
            },
            5213: function (e, t, a) {
                'use strict';
                var o =
                        (this && this.__awaiter) ||
                        function (e, t, a, o) {
                            return new (a || (a = Promise))(function (n, i) {
                                function r(e) {
                                    try {
                                        s(o.next(e));
                                    } catch (e) {
                                        i(e);
                                    }
                                }
                                function l(e) {
                                    try {
                                        s(o.throw(e));
                                    } catch (e) {
                                        i(e);
                                    }
                                }
                                function s(e) {
                                    var t;
                                    e.done
                                        ? n(e.value)
                                        : ((t = e.value),
                                          t instanceof a
                                              ? t
                                              : new a(function (e) {
                                                    e(t);
                                                })).then(r, l);
                                }
                                s((o = o.apply(e, t || [])).next());
                            });
                        },
                    n =
                        (this && this.__importDefault) ||
                        function (e) {
                            return e && e.__esModule ? e : { default: e };
                        };
                Object.defineProperty(t, '__esModule', { value: !0 });
                const i = n(a(7344)),
                    r = n(a(7176)),
                    l = n(a(3715)),
                    s = n(a(6739)),
                    d = n(a(5401)),
                    f = n(a(8027)),
                    u = n(a(2341)),
                    c = n(a(9745)),
                    p = n(a(8021));
                let m = {};
                function g(e) {
                    return void 0 !== e.changedTouches;
                }
                (m.checkPrimaryButton = !0),
                    (m.primaryMouseButtonDown = !1),
                    (m.misclickCounter = 0),
                    (m.lock = e => {
                        i.default.lock[e] = !0;
                    }),
                    (m.unlock = e => {
                        i.default.lock[e] = !1;
                    }),
                    (m.isLocked = () => {
                        let e = !1;
                        for (let t in i.default.lock) i.default.lock[t] && (e = !0);
                        return e;
                    }),
                    (m.softLock = e => {
                        i.default.softLock[e] = !0;
                    }),
                    (m.softUnlock = e => {
                        i.default.softLock[e] = !1;
                    }),
                    (m.isSoftLocked = () => {
                        let e = !1;
                        for (let t in i.default.softLock) i.default.softLock[t] && (e = !0);
                        return e;
                    }),
                    (m.getXPos = e => (g(e) ? 2 * e.changedTouches[0].pageX : 2 * e.offsetX)),
                    (m.getYPos = e =>
                        g(e)
                            ? 2 * (e.changedTouches[0].pageY - e.changedTouches[0].target.offsetTop)
                            : 2 * e.offsetY),
                    (m.getPossibleTargetFromFromSetCard = e => {
                        if ('canvas' != e.target.id) return !1;
                        const t = i.default.fromSet.card.position.x,
                            a = i.default.fromSet.card.position.y,
                            o = i.default.cardWidth,
                            n = i.default.cardHeight,
                            l = [
                                { x: t, y: a },
                                { x: t + o, y: a },
                                { x: t + o, y: a + n },
                                { x: t, y: a + n },
                            ];
                        for (let e = 0; e < l.length; e++) {
                            const t = l[e];
                            let a = r.default.getTarget(t.x, t.y);
                            if (
                                f.default.can('drop', i.default.fromSet, a) &&
                                !m.isTargetSameAsFrom(a)
                            )
                                return a;
                        }
                        return null;
                    }),
                    (m.getTargetFromEvent = e => {
                        if ('canvas' != e.target.id) return !1;
                        let t = m.getXPos(e),
                            a = m.getYPos(e);
                        return r.default.getTarget(t, a);
                    }),
                    (m.isTargetSameAsFrom = e =>
                        e.area == i.default.fromSet.area && e.pile == i.default.fromSet.pile),
                    (m.drag = e => {
                        var t, a, o;
                        if ('canvas' !== e.target.id) return !1;
                        if (m.isLocked()) return;
                        let n = m.getTargetFromEvent(e);
                        (null ===
                            (o =
                                null ===
                                    (a =
                                        null === (t = null == n ? void 0 : n.area) || void 0 === t
                                            ? void 0
                                            : t.piles) || void 0 === a
                                    ? void 0
                                    : a[n.pile]) || void 0 === o
                            ? void 0
                            : o[n.position]) &&
                            (p.default.clearHighlightCard(),
                            (i.default.fromSet = n),
                            f.default.can('drag', i.default.fromSet, n)
                                ? (e.preventDefault(),
                                  l.default.start(),
                                  (i.default.clickStart = performance.now()),
                                  (n.area.piles[n.pile][n.position].hide = !0),
                                  (i.default.float = n.area.piles[n.pile].slice(n.position)),
                                  (i.default.fromSet.offset = {}),
                                  (i.default.fromSet.offset.x = n.offsets.x),
                                  (i.default.fromSet.offset.y = n.offsets.y),
                                  m.setCardPosition(e),
                                  window.addEventListener('mousemove', m.setCardPosition),
                                  window.addEventListener('touchmove', m.setCardPosition))
                                : ((i.default.fromSet = {}), f.default.showFlashMessage('drag')));
                    }),
                    (m.drop = e => {
                        if ((p.default.clearHighlightCard(), m.isLocked())) return;
                        if (0 == i.default.float.length) return !1;
                        let t = m.getTargetFromEvent(e),
                            a = m.getPossibleTargetFromFromSetCard(e);
                        e.preventDefault(),
                            window.removeEventListener('mousemove', m.setCardPosition),
                            window.removeEventListener('touchmove', m.setCardPosition),
                            performance.now() - i.default.clickStart < 250 &&
                            m.isTargetSameAsFrom(t) &&
                            !$('.enable-autoplay').length
                                ? m.click(e, t)
                                : f.default.can('drop', i.default.fromSet, t)
                                ? (0 == t.area.piles[t.pile].length && (t.position = -1),
                                  m.completeDrop(e, t))
                                : a
                                ? (0 == a.area.piles[a.pile].length && (a.position = -1),
                                  m.completeDrop(e, a))
                                : ((i.default.float = []),
                                  r.default.resetCards(),
                                  r.default.drawGame(),
                                  m.isTargetSameAsFrom(t) || f.default.showFlashMessage('drop'));
                    }),
                    (m.completeDrop = (e, t, a = !1, o = !1, n = !1) =>
                        new Promise(e => {
                            var p;
                            m.lock('drop'), c.default.setSnapshot();
                            let g = { name: t.area.name, pile: t.pile, position: t.position },
                                h = {
                                    name: i.default.fromSet.area.name,
                                    pile: i.default.fromSet.pile,
                                    position: i.default.fromSet.position,
                                };
                            const v =
                                null === (p = i.default.fromSet.area.piles[h.pile][h.position]) ||
                                void 0 === p
                                    ? void 0
                                    : p.name;
                            let w = {
                                start: Date.now(),
                                undo: a,
                                redo: o,
                                card: v,
                                from: null == h ? void 0 : h.name,
                                fromPile: null == h ? void 0 : h.pile,
                                fromPosition: null == h ? void 0 : h.position,
                                to: null == g ? void 0 : g.name,
                                toPile: null == g ? void 0 : g.pile,
                                toPosition: null == g ? void 0 : g.position,
                            };
                            if (
                                (c.default.logMove(w),
                                c.default.addPayload({ to: g, from: h, undo: a, redo: o }),
                                l.default.start(),
                                void 0 !==
                                    i.default.fromSet.area.piles[i.default.fromSet.pile][
                                        i.default.fromSet.position - 1
                                    ] &&
                                0 ==
                                    i.default.fromSet.area.piles[i.default.fromSet.pile][
                                        i.default.fromSet.position - 1
                                    ].turnedup
                                    ? ((h.flipPosition = i.default.fromSet.position - 1),
                                      (h.rotation = h.flipTurnUpFrom = 0),
                                      (h.rotationMax = h.flipTurnUpTo = 1),
                                      (g.flipPosition = i.default.fromSet.position - 1),
                                      (g.rotation = g.flipTurnUpFrom = 1),
                                      (g.rotationMax = g.flipTurnUpTo = 0))
                                    : void 0 !== i.default.fromSet.flipPosition &&
                                      ((h.flipPosition = i.default.fromSet.flipPosition),
                                      (h.rotation = h.flipTurnUpFrom =
                                          i.default.fromSet.flipTurnUpFrom),
                                      (h.rotationMax = h.flipTurnUpTo =
                                          i.default.fromSet.flipTurnUpTo),
                                      (g.flipPosition = t.flipPosition),
                                      (g.rotation = g.flipTurnUpFrom = t.flipTurnUpFrom),
                                      (g.rotationMax = g.flipTurnUpTo = t.flipTurnUpTo)),
                                !a)
                            ) {
                                let e = { to: g, from: h };
                                o || (d.default.addUndo(e), d.default.clearRedo());
                            }
                            if (
                                (i.default.fromSet.area.piles[i.default.fromSet.pile].splice(
                                    i.default.fromSet.position
                                ),
                                void 0 !== h.flipPosition)
                            ) {
                                let e;
                                (e = a
                                    ? t.area.piles[t.pile].splice(t.flipPosition).pop()
                                    : i.default.fromSet.area.piles[i.default.fromSet.pile]
                                          .splice(h.flipPosition)
                                          .pop()),
                                    (e.position.rotation = h.rotation),
                                    (e.position.rotationMax = h.rotationMax),
                                    (e.position.flipTurnUpFrom = h.flipTurnUpFrom),
                                    (e.position.flipTurnUpTo = h.flipTurnUpTo),
                                    i.default.float.unshift(e);
                            }
                            let y = gsap.timeline({
                                    onStart: () => {
                                        m.lock('drop');
                                    },
                                    onComplete: () => {
                                        (i.default.float = []),
                                            r.default.resetCards(),
                                            t.triggerNextUndo || r.default.sizeToFit(),
                                            (w.end = Date.now()),
                                            r.default.drawGame(),
                                            s.default.updateTurn(1),
                                            m.unlock('drop'),
                                            c.default.verifyAction('drop', w),
                                            n ||
                                                (f.default.hasGameBeenWon() &&
                                                    ((i.default.gameWon = !0),
                                                    i.default.dispatch(i.default.finishGameEvent)),
                                                t.triggerNextUndo
                                                    ? window.dispatchEvent(
                                                          i.default.triggerNextUndo
                                                      )
                                                    : window.dispatchEvent(
                                                          i.default.dropCompleted
                                                      )),
                                            e();
                                    },
                                }),
                                b = 0,
                                S = 0,
                                x = i.default.getDeltaRatioDuration(0.25);
                            for (
                                i.default.gameWon && (x = i.default.getDeltaRatioDuration(0.1));
                                b < i.default.float.length;

                            ) {
                                let e = i.default.float[b];
                                if (void 0 !== e.position.rotationMax) {
                                    let o = i.default.fromSet.area,
                                        n = i.default.fromSet.pile,
                                        l = i.default.fromSet.position - 1,
                                        s = i.default.fromSet.area.collapse;
                                    if (
                                        (a &&
                                            ((o = t.area),
                                            (n = t.pile),
                                            (l = t.position),
                                            (s = t.area.collapse)),
                                        (e.position.x = e.position.xMax =
                                            r.default.getXOffset(o, n)),
                                        (e.position.y = e.position.yMax =
                                            r.default.getYOffset(o, n)),
                                        !s)
                                    ) {
                                        const t = l * o.cardYOffset[n];
                                        (e.position.y += t), (e.position.yMax += t);
                                    }
                                    S = -1;
                                } else {
                                    let a = t.area.piles[t.pile].length - 1;
                                    'undefined' != typeof numTurns &&
                                        t.area.piles[t.pile].length <= numTurns &&
                                        (a = t.area.piles[t.pile].length),
                                        (e.position.xMax =
                                            r.default.getXOffset(t.area, t.pile) +
                                            r.default.getExtraXOffset(t.area, t.pile, a)),
                                        (e.position.yMax = r.default.getYOffset(
                                            t.area,
                                            t.position
                                        )),
                                        t.area.collapse ||
                                            (e.position.yMax +=
                                                (t.position + b + 1 + S) *
                                                t.area.cardYOffset[t.pile]);
                                }
                                (e.hide = !1),
                                    y.to(
                                        e.position,
                                        {
                                            duration: x,
                                            ease: 'power2.out',
                                            x: e.position.xMax,
                                            y: e.position.yMax,
                                            rotation: e.position.rotationMax,
                                            onStart: () => {
                                                1 == e.turnedup && u.default.cardFlip();
                                            },
                                            onUpdate: () => {
                                                r.default.drawGame();
                                            },
                                            onComplete: () => {
                                                let o = i.default.fromSet,
                                                    n = t;
                                                a && ((o = t), (n = t)),
                                                    void 0 !== e.position.rotationMax
                                                        ? ((e.turnedup = h.flipTurnUpTo),
                                                          o.area.piles[o.pile].push(e))
                                                        : n.area.piles[n.pile].push(e),
                                                    r.default.drawGame();
                                            },
                                        },
                                        b / 20
                                    ),
                                    b++;
                            }
                        })),
                    (m.completeMoves = (e, t) =>
                        o(void 0, void 0, void 0, function* () {
                            for (let a = 0; a < e.length; a++) {
                                const o = e[a],
                                    n = e[a + 1];
                                let r = o && o.start && n && n.start ? n.start - o.start : 400;
                                r = Math.min(r, 2e3);
                                const l = new Promise(e => {
                                    setTimeout(e, r);
                                });
                                if ('deal' === o.action) {
                                    yield t(o.undo, o.redo, { from: { loopEnd: o.loopTurns } }),
                                        m.lock('deal'),
                                        yield l,
                                        m.unlock('deal');
                                    continue;
                                }
                                const s = i.default.allAreas.find(e => e.name === o.from),
                                    d = s.piles[o.fromPile][o.fromPosition],
                                    f = {
                                        area: i.default.allAreas.find(e => e.name === o.to),
                                        pile: o.toPile,
                                        position: o.toPosition,
                                    };
                                m.setFromSet({
                                    area: s,
                                    card: d,
                                    pile: o.fromPile,
                                    position: o.fromPosition,
                                    target: f,
                                }),
                                    yield m.completeDrop(null, f, o.undo, o.redo, !0),
                                    m.lock('deal'),
                                    yield l,
                                    m.unlock('deal');
                            }
                        })),
                    (m.animateCompleteDrop = e => {
                        m.lock('drop');
                        let t = { name: e.area.name, pile: e.pile, position: e.position },
                            a = {
                                name: i.default.fromSet.area.name,
                                pile: i.default.fromSet.pile,
                                position: i.default.fromSet.position,
                            };
                        const o = { start: Date.now(), action: 'hint-animateCompleteDrop' };
                        if (
                            (c.default.logMove(o),
                            void 0 !==
                                i.default.fromSet.area.piles[i.default.fromSet.pile][
                                    i.default.fromSet.position - 1
                                ] &&
                            0 ==
                                i.default.fromSet.area.piles[i.default.fromSet.pile][
                                    i.default.fromSet.position - 1
                                ].turnedup
                                ? ((a.flipPosition = i.default.fromSet.position - 1),
                                  (a.rotation = a.flipTurnUpFrom = 0),
                                  (a.rotationMax = a.flipTurnUpTo = 1),
                                  (t.flipPosition = i.default.fromSet.position - 1),
                                  (t.rotation = t.flipTurnUpFrom = 1),
                                  (t.rotationMax = t.flipTurnUpTo = 0))
                                : void 0 !== i.default.fromSet.flipPosition &&
                                  ((a.flipPosition = i.default.fromSet.flipPosition),
                                  (a.rotation = a.flipTurnUpFrom =
                                      i.default.fromSet.flipTurnUpFrom),
                                  (a.rotationMax = a.flipTurnUpTo = i.default.fromSet.flipTurnUpTo),
                                  (t.flipPosition = e.flipPosition),
                                  (t.rotation = t.flipTurnUpFrom = e.flipTurnUpFrom),
                                  (t.rotationMax = t.flipTurnUpTo = e.flipTurnUpTo)),
                            i.default.fromSet.area.piles[i.default.fromSet.pile]
                                .slice(i.default.fromSet.position)
                                .forEach(e => {
                                    e.hide = !0;
                                }),
                            void 0 !== a.flipPosition)
                        ) {
                            let e = i.default.fromSet.area.piles[i.default.fromSet.pile]
                                .slice(a.flipPosition)
                                .slice(0)[0];
                            (e.position.rotation = a.rotation),
                                (e.position.rotationMax = a.rotationMax),
                                (e.position.flipTurnUpFrom = a.flipTurnUpFrom),
                                (e.position.flipTurnUpTo = a.flipTurnUpTo),
                                i.default.float.unshift(e);
                        }
                        let n = gsap.timeline({
                                repeat: 1,
                                yoyo: !0,
                                onStart: () => {
                                    m.lock('drop');
                                },
                                onComplete: () => {
                                    (i.default.float = []),
                                        r.default.resetCards(),
                                        r.default.sizeToFit(),
                                        r.default.drawGame(),
                                        m.unlock('drop');
                                },
                            }),
                            l = 0,
                            s = 0;
                        for (; l < i.default.float.length; ) {
                            let t = i.default.float[l];
                            if (void 0 !== t.position.rotationMax) {
                                let e = i.default.fromSet.area,
                                    o = i.default.fromSet.pile;
                                (t.position.x = t.position.xMax = r.default.getXOffset(e, o)),
                                    (t.position.y = t.position.yMax = r.default.getYOffset(e, o)),
                                    i.default.fromSet.area.collapse ||
                                        ((t.position.y +=
                                            a.flipPosition * i.default.fromSet.area.cardYOffset[o]),
                                        (t.position.yMax +=
                                            a.flipPosition *
                                            i.default.fromSet.area.cardYOffset[o])),
                                    (s = -1);
                            } else {
                                let a = e.area.piles[e.pile].length - 1;
                                'undefined' != typeof numTurns &&
                                    e.area.piles[e.pile].length <= numTurns &&
                                    (a = e.area.piles[e.pile].length),
                                    (t.position.xMax =
                                        r.default.getXOffset(e.area, e.pile) +
                                        r.default.getExtraXOffset(e.area, e.pile, a)),
                                    (t.position.yMax = r.default.getYOffset(e.area, e.position)),
                                    e.area.collapse ||
                                        (t.position.yMax +=
                                            (e.position + l + 1 + s) * e.area.cardYOffset[e.pile]);
                            }
                            let o = i.default.getDeltaRatioDuration(0.25);
                            n.to(
                                t.position,
                                {
                                    duration: 3 * o,
                                    ease: 'power2.out',
                                    x: t.position.xMax,
                                    y: t.position.yMax,
                                    rotation: t.position.rotationMax,
                                    onStart: () => {
                                        1 == t.turnedup && u.default.cardFlip();
                                    },
                                    onUpdate: () => {
                                        r.default.drawGame();
                                    },
                                    onComplete: () => {
                                        r.default.drawGame();
                                    },
                                },
                                l / 20
                            ),
                                l++;
                        }
                    }),
                    (m.animateStockCard = ({
                        area: e,
                        card: t,
                        pile: a,
                        position: o,
                        reverseDirection: n = !1,
                    }) => {
                        m.lock('drop');
                        const l = n ? -100 : 100;
                        (i.default.float = [t]),
                            (i.default.fromSet = { area: e, card: t, pile: a, position: o }),
                            (t.position.x = r.default.getXOffset(e, 0)),
                            (t.position.y = r.default.getYOffset(e, 0));
                        let s = i.default.getDeltaRatioDuration(0.25);
                        gsap.timeline({
                            onStart: () => {
                                t.hide = !0;
                            },
                            onComplete: () => {
                                (t.hide = !1),
                                    (i.default.float = []),
                                    r.default.resetCards(),
                                    r.default.sizeToFit(),
                                    r.default.drawGame(),
                                    m.unlock('drop');
                            },
                        }).to(t.position, {
                            repeat: 1,
                            yoyo: !0,
                            duration: s,
                            ease: 'power2.out',
                            x: t.position.x + l,
                            y: t.position.y,
                            onStart: () => {
                                1 == t.turnedup && u.default.cardFlip();
                            },
                            onUpdate: () => {
                                r.default.drawGame();
                            },
                            onComplete: () => {
                                r.default.drawGame();
                            },
                        });
                    }),
                    (m.animateCard = ({ area: e, pile: t, position: a }) => (
                        m.lock('drop'),
                        new Promise(o => {
                            const n = e.piles[t].slice(a);
                            let l = i.default.getDeltaRatioDuration(0.025),
                                s = gsap.timeline({
                                    onStart: () => {
                                        (i.default.float = n), u.default.failSound();
                                    },
                                    onComplete: () => {
                                        (i.default.float = []),
                                            r.default.resetCards(),
                                            r.default.sizeToFit(),
                                            r.default.drawGame(),
                                            m.unlock('drop'),
                                            o();
                                    },
                                });
                            n.forEach((o, n) => {
                                const i = a + n;
                                (o.position.x =
                                    r.default.getXOffset(e, t) +
                                    r.default.getExtraXOffset(e, t, a)),
                                    (o.position.y =
                                        r.default.getYOffset(e, i) + i * e.cardYOffset[t]),
                                    s.to(
                                        o.position,
                                        {
                                            repeat: 1,
                                            yoyo: !0,
                                            duration: l,
                                            ease: 'power2.out',
                                            x: o.position.x + 5,
                                            y: o.position.y,
                                            onUpdate: () => {
                                                r.default.drawGame();
                                            },
                                            onComplete: () => {
                                                r.default.drawGame();
                                            },
                                        },
                                        0
                                    ),
                                    s.to(
                                        o.position,
                                        {
                                            repeat: 1,
                                            yoyo: !0,
                                            duration: l,
                                            ease: 'power2.out',
                                            x: o.position.x - 5,
                                            y: o.position.y,
                                            onUpdate: () => {
                                                r.default.drawGame();
                                            },
                                            onComplete: () => {
                                                r.default.drawGame();
                                            },
                                        },
                                        '>'
                                    );
                            });
                        })
                    )),
                    (m.getWeight = e => e.area.toWeight),
                    (m.setWeightFn = e => {
                        m.getWeight = e;
                    }),
                    (m.findTarget = () => {
                        let e = -1,
                            t = null;
                        for (let a = 0; a < i.default.allAreas.length; a++)
                            for (let o = 0; o < i.default.allAreas[a].piles.length; o++)
                                if (i.default.allAreas[a].piles[o].length > 0)
                                    for (
                                        let n = 0;
                                        n < i.default.allAreas[a].piles[o].length;
                                        n++
                                    ) {
                                        let r = {
                                            area: i.default.allAreas[a],
                                            card: i.default.allAreas[a].piles[o][n],
                                            pile: o,
                                            position: n,
                                        };
                                        if (
                                            f.default.can('drop', i.default.fromSet, r) &&
                                            !m.isTargetSameAsFrom(r)
                                        ) {
                                            let a = m.getWeight(r);
                                            a > e && ((e = a), (t = r));
                                        }
                                    }
                                else {
                                    let n = {
                                        area: i.default.allAreas[a],
                                        card: null,
                                        pile: o,
                                        position: -1,
                                    };
                                    if (
                                        f.default.can('drop', i.default.fromSet, n) &&
                                        !m.isTargetSameAsFrom(n)
                                    ) {
                                        let a = m.getWeight(n);
                                        a > e && ((e = a), (t = n));
                                    }
                                }
                        return t;
                    }),
                    (m.click = e => {
                        if (m.isLocked()) return;
                        const t = m.findTarget();
                        if (null !== t) return m.completeDrop(e, t), void (m.misclickCounter = 0);
                        m.misclickCounter++,
                            r.default.resetCards(),
                            (i.default.float = []),
                            r.default.drawGame(),
                            m.misclickCounter > 0 && m.animateCard(i.default.fromSet);
                    }),
                    (m.setFromSet = ({ area: e, card: t, pile: a, position: o, target: n }) => {
                        (i.default.float = e.piles[a].slice(o)),
                            (i.default.fromSet = { area: e, card: t, pile: a, position: o });
                        for (let t = 0; t < i.default.float.length; t++)
                            try {
                                i.default.float[t].position = {
                                    x:
                                        r.default.getXOffset(e, a) +
                                        r.default.getExtraXOffset(e, a, o),
                                    xMax:
                                        r.default.getXOffset(n.area, n.pile) +
                                        r.default.getExtraXOffset(n.area, n.pile, n.position),
                                    y: r.default.getYOffset(e, a) + (o + t) * e.cardYOffset[a],
                                    yMax:
                                        r.default.getYOffset(n.area, n.pile) +
                                        (n.position + t) * n.area.cardYOffset[n.pile],
                                    rotation: 1,
                                };
                            } catch (e) {
                                recordError(e);
                            }
                    }),
                    (m.animateClick = ({ area: e, card: t, pile: a, position: o, target: n }) => {
                        m.setFromSet({ area: e, card: t, pile: a, position: o, target: n });
                        const l = m.findTarget();
                        null === l
                            ? (r.default.resetCards(), (i.default.float = []), r.default.drawGame())
                            : m.animateCompleteDrop(l);
                    }),
                    (m.reset = () => {
                        (i.default.float = []), r.default.resetCards(), r.default.drawGame();
                    }),
                    (m.setCardPosition = e => {
                        if (!m.isLocked())
                            if (!m.checkPrimaryButton || m.primaryMouseButtonDown) {
                                if ('canvas' == e.target.id) {
                                    for (let t = 0; t < i.default.float.length; t++)
                                        try {
                                            (i.default.float[t].position = {}),
                                                (i.default.float[t].position.x =
                                                    m.getXPos(e) - i.default.fromSet.offset.x),
                                                (i.default.float[t].position.y =
                                                    m.getYPos(e) +
                                                    t *
                                                        i.default.fromSet.area.cardYOffset[
                                                            i.default.fromSet.pile
                                                        ] -
                                                    i.default.fromSet.offset.y);
                                        } catch (e) {
                                            recordError(e);
                                        }
                                    r.default.drawGame();
                                }
                            } else m.reset();
                    }),
                    (m.setPrimaryButtonState = e => {
                        if (!m.checkPrimaryButton) return !1;
                        if (['touchstart', 'touchmove', 'touchend'].includes(e.type))
                            return void (m.checkPrimaryButton = !1);
                        let t = g(e) ? e.which : e.buttons;
                        m.primaryMouseButtonDown = 1 == (1 & t);
                    }),
                    window.addEventListener('touchmove', m.setPrimaryButtonState),
                    window.addEventListener('mousemove', m.setPrimaryButtonState),
                    window.addEventListener('touchstart', m.setPrimaryButtonState),
                    window.addEventListener('mousedown', m.setPrimaryButtonState),
                    window.addEventListener('touchend', m.setPrimaryButtonState),
                    window.addEventListener('mouseup', m.setPrimaryButtonState),
                    (t.default = m);
            },
            2341: function (e, t) {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 });
                let a = {
                    test: !0,
                    play: e => {
                        try {
                            if (
                                ((window.AudioContext =
                                    window.AudioContext || window.webkitAudioContext),
                                window.AudioContext)
                            ) {
                                if ('suspended' == new window.AudioContext().state) return;
                                e.play();
                            }
                        } catch (e) {
                            recordError(e);
                        }
                    },
                    checkToggle: () => {
                        let e;
                        return (
                            $('.audio-toggle').hasClass('audio-toggle-off') && (e = 'off'),
                            $('.audio-toggle').hasClass('audio-toggle-on') && (e = 'on'),
                            'on' == e
                        );
                    },
                    cardFlip: () => {
                        if (a.checkToggle()) {
                            let e = new Audio('/audio/card-flip-3.mp3');
                            a.play(e);
                        }
                    },
                    failSound: () => {
                        if (a.checkToggle()) {
                            let e = new Audio('/audio/bonk-sound-effect.mp3');
                            (e.volume = 0.1), a.play(e);
                        }
                    },
                    moveToFoundation: () => {
                        if (a.checkToggle()) {
                            let e = new Audio('/audio/move-to-foundation.mp3');
                            a.play(e);
                        }
                    },
                    congrats: () => {
                        if (a.checkToggle()) {
                            let e = new Audio('/audio/congrats.mp3');
                            a.play(e);
                        }
                    },
                };
                (t.default = a), (window.audio = a);
            },
            5158: function (e, t) {
                'use strict';
                t.seedStatsInteraction = t.hotKeyUsedInGame = void 0;
                const a = {};
                t.hotKeyUsedInGame = function (e) {
                    if (!a[e]) {
                        a[e] = !0;
                        try {
                            gtag('event', `'${e}' used`, { event_category: 'hotkeys', value: 1 });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                };
                const o = {};
                t.seedStatsInteraction = function (e) {
                    if (!o[e]) {
                        o[e] = !0;
                        try {
                            gtag('event', `seed stats interaction: ${e}`, {
                                event_category: 'klondike',
                                value: 1,
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                };
            },
            7176: function (e, t, a) {
                'use strict';
                var o =
                    (this && this.__importDefault) ||
                    function (e) {
                        return e && e.__esModule ? e : { default: e };
                    };
                Object.defineProperty(t, '__esModule', { value: !0 });
                const n = o(a(7344)),
                    i = o(a(3558)),
                    r = o(a(5401)),
                    l = o(a(5213)),
                    s = o(a(8021)),
                    d = o(a(8027)),
                    f = o(a(9226)),
                    u = o(a(2341)),
                    c = a(1022);
                let p = {
                    setDrawFn: e => {
                        p.drawFn = e;
                    },
                    drawGame: () => {
                        p.drawFn();
                    },
                    mapImages: e => {
                        void 0 === n.default.images_canvas[e] &&
                            (n.default.images_canvas[e] = document.createElement('canvas')),
                            (n.default.images_canvas[e].width = n.default.cardWidth),
                            (n.default.images_canvas[e].height = n.default.cardHeight);
                        const t = n.default.images_canvas[e].getContext('2d');
                        t.clearRect(0, 0, n.default.cardWidth, n.default.cardHeight),
                            t.drawImage(
                                n.default.images[e],
                                0,
                                0,
                                n.default.cardWidth,
                                n.default.cardHeight
                            );
                    },
                    drawImages: e => {
                        p.drawLegacy(e);
                    },
                    drawLegacy: e => {
                        (n.default.images[e] = new Image()),
                            imageFolder.indexOf('style-classic-') > -1 && (0, c.isMobile)()
                                ? (n.default.images[e].src =
                                      'card_base' == e
                                          ? '/images/style-classic-mobile-svg/card_base-2.svg'
                                          : 'logo' == e
                                          ? gameOfTheDay
                                              ? '/images/favicons/logo-gotd.svg'
                                              : '/images/favicons/logo-black.svg'
                                          : `/images/style-classic-mobile-svg/${e}.svg`)
                                : (n.default.images[e].src =
                                      'card_base' == e
                                          ? '/images/style-classic-2/card_base-2.png'
                                          : 'logo' == e
                                          ? gameOfTheDay
                                              ? '/images/favicons/logo-gotd.svg'
                                              : '/images/favicons/logo-black.svg'
                                          : `${imageFolder}/${e}.png`),
                            n.default.images[e].addEventListener('load', () => {
                                p.mapImages(e),
                                    n.default.imageQueue++,
                                    n.default.imageQueue == image_names.length &&
                                        (window.dispatchEvent(n.default.imagesLoaded),
                                        (n.default.imageQueue = 0));
                            });
                    },
                    redrawImages: () => {
                        (n.default.imageQueue = 0), image_names.forEach(p.drawLegacy);
                    },
                    replaceCardBack: (e, t) => {
                        (cardBack = e),
                            (n.default.images.back_red = new Image()),
                            (n.default.images.back_red.src = e),
                            n.default.images.back_red.addEventListener('load', () => {
                                p.mapImages('back_red'), t && p.drawGame();
                            });
                    },
                    getXOffset: (e, t) => {
                        let a = e.offset.x;
                        return (
                            (0, c.isMobile)() && (a = e.mobileOffset.x),
                            a * (n.default.cardWidth + n.default.cardSpacing) +
                                e.orientation.x *
                                    t *
                                    (n.default.cardWidth + n.default.cardSpacing) +
                                n.default.cardSpacing
                        );
                    },
                    getYOffset: (e, t) =>
                        e.offset.y * (n.default.cardHeight + n.default.cardSpacing) +
                        e.orientation.y * t * (n.default.cardHeight + n.default.cardSpacing) +
                        n.default.cardSpacing,
                    getXCoords: e => {
                        let t = p.getXOffset(e, 0),
                            a = p.getXOffset(e, e.piles.length);
                        return (
                            (a += p.getExtraXOffset(e, 0, e.piles[0].length - 1)),
                            { from: t, to: a, width: a - t }
                        );
                    },
                    getYCoords: e => {
                        let t = 0;
                        for (let a = 0; a < e.piles.length; a++)
                            for (let o = 0; o < e.piles[a].length; o++) o >= t && (t = o);
                        e.collapse && (t = 0);
                        let a = p.getYOffset(e, 0),
                            o = a + t * n.default.cardStep + n.default.cardHeight;
                        return { from: a, to: o, height: o - a };
                    },
                    updateCardFactors: (e, t) => {
                        void 0 !== n.default.cardFactors[e] &&
                            ((n.default.cardFactors[e] = t), p.sizeToFit());
                    },
                    getTotalColumns: () => {
                        let e = {};
                        for (let t = 0; t < n.default.allAreas.length; t++) {
                            let a = n.default.allAreas[t].offset.x;
                            (0, c.isMobile)() && (a = n.default.allAreas[t].mobileOffset.x);
                            let o =
                                (a + n.default.allAreas[t].piles.length) *
                                n.default.allAreas[t].orientation.x;
                            (void 0 === e[n.default.allAreas[t].offset.y] ||
                                e[n.default.allAreas[t].offset.y] < o) &&
                                (e[n.default.allAreas[t].offset.y] = o);
                        }
                        let t = 0;
                        for (let a in e) e[a] > t && (t = e[a]);
                        return t;
                    },
                    isTabletPortrait: () => window.innerWidth < window.innerHeight,
                    sizeToFit: () => {
                        var e;
                        let t = 0;
                        $('#adSidebarContainer').is(':visible') &&
                            (t = $('#adSidebarContainer').width()),
                            imageFolder.indexOf('style-classic-') > -1 &&
                                (0, c.isMobile)() &&
                                ((n.default.cardFactors.stepMax = 0.3),
                                (n.default.cardFactors.height = 1.305));
                        let a =
                                document.getElementById('timerContainer').clientHeight /
                                document.getElementById('timerContainer').clientWidth,
                            o =
                                document.getElementById('timerContainer').clientHeight +
                                document.getElementById('timerContainerBottom').clientHeight,
                            i = document.body.clientWidth - t;
                        i >= 8192 && (i = 8192),
                            (n.default.canvas.style.width = i + 'px'),
                            (n.default.canvas.width = 2 * i),
                            0 == n.default.canvas.width && (n.default.canvas.width = 100);
                        let r =
                            (null === (e = document.getElementById('aboveNav')) || void 0 === e
                                ? void 0
                                : e.clientHeight) || 0;
                        a > 1 &&
                            ((n.default.canvas.style.width =
                                i - document.getElementById('timerContainer').clientWidth + 'px'),
                            (n.default.canvas.width =
                                2 * (i - document.getElementById('timerContainer').clientWidth)),
                            (o = document.getElementById('timerContainerBottom').clientHeight));
                        let s =
                            window.innerHeight -
                            document.getElementById('site-header').clientHeight -
                            r -
                            o;
                        s >= 8192 && (s = 8192),
                            (n.default.canvas.style.height = s - 15 + 'px'),
                            (n.default.canvas.height = 2 * s - 30),
                            (0, c.isMobile)() &&
                                s > 320 &&
                                ((n.default.canvas.style.height = s - 15 - 185 + 'px'),
                                (n.default.canvas.height = 2 * s - 30 - 369)),
                            (n.default.cardWidth = Math.round(
                                n.default.canvas.width /
                                    (p.getTotalColumns() +
                                        p.getTotalColumns() * n.default.cardFactors.spacing)
                            )),
                            (n.default.cardSpacing = Math.round(
                                n.default.cardWidth * (n.default.cardFactors.spacing / 2)
                            )),
                            (n.default.cardXOffset = n.default.cardWidth / 5),
                            (n.default.cardHeight = Math.round(
                                n.default.cardWidth * n.default.cardFactors.height
                            )),
                            (n.default.cardStep = Math.round(
                                n.default.cardHeight * n.default.cardFactors.stepMax
                            ));
                        let d = n.default.canvas.height / (7 * n.default.cardFactors.stepMax + 2);
                        n.default.cardHeight > d &&
                            ((n.default.cardHeight = Math.round(d)),
                            (n.default.cardWidth = Math.round(
                                n.default.cardHeight / n.default.cardFactors.height
                            )),
                            (n.default.cardSpacing = Math.round(
                                n.default.cardWidth * (n.default.cardFactors.spacing / 2)
                            )),
                            (n.default.cardStep = Math.round(
                                n.default.cardHeight * n.default.cardFactors.stepMax
                            )));
                        let f = !1;
                        for (let e = 0; e < n.default.allAreas.length; e++)
                            if (!n.default.allAreas[e].collapse) {
                                f = n.default.allAreas[e];
                                break;
                            }
                        for (let e = 0; e < n.default.allAreas.length; e++)
                            void 0 !== n.default.allAreas[e].cardXOffset &&
                                n.default.allAreas[e].cardXOffset > 0 &&
                                (n.default.allAreas[e].cardXOffset[0] = n.default.cardWidth / 5);
                        let u = !1,
                            m = JSON.parse(JSON.stringify(f.cardYOffset));
                        for (let e = 0; e < f.piles.length; e++) {
                            (!f || (void 0 !== f.cardYOffset && 0 == f.cardYOffset[e])) &&
                                (f.cardYOffset[e] =
                                    (n.default.canvas.height -
                                        n.default.cardHeight * (1 + f.offset.y)) /
                                    f.piles.length);
                            let t = f.piles[e].length;
                            0 == f.piles[e].length && (t = f.distribution[e]),
                                (m[e] =
                                    (n.default.canvas.height -
                                        n.default.cardHeight * (1 + f.offset.y)) /
                                    t),
                                m[e] > n.default.cardStep && (m[e] = n.default.cardStep),
                                f.cardYOffset[e] != m[e] && (u = !0),
                                n.default.isNewGame && (f.cardYOffset[e] = m[e]);
                        }
                        if (!u) return;
                        if (n.default.isNewGame) return;
                        let g = gsap.timeline({
                            onStart: () => {
                                l.default.softLock('sizeToFit');
                            },
                            onComplete: () => {
                                p.drawGame(), l.default.softUnlock('sizeToFit');
                            },
                        });
                        for (let e = 0; e < f.cardYOffset.length; e++) {
                            let t = { x: f.cardYOffset[e] };
                            g.to(
                                t,
                                {
                                    duration: n.default.getDeltaRatioDuration(0.25),
                                    ease: 'sine.out',
                                    x: m[e],
                                    onUpdate: () => {
                                        (f.cardYOffset[e] = t.x), p.drawGame();
                                    },
                                },
                                '0'
                            );
                        }
                    },
                    setYOffset: (e, t) => (e.collapse ? 0 : t),
                    getTarget: (e, t) => {
                        let a = !1,
                            o = !1,
                            i = { area: a, card: !1, pile: o, position: !1 };
                        for (let r = 0; r < n.default.allAreas.length; r++) {
                            let l = p.getXCoords(n.default.allAreas[r]),
                                s = p.getYCoords(n.default.allAreas[r]),
                                d = { xFrom: l.from, xTo: l.to, yFrom: s.from, yTo: s.to };
                            if (!(e < d.xFrom || e > d.xTo || t < d.yFrom || t > d.yTo)) {
                                if (i.card || i.pile || i.position) return i;
                                if (((i.area = a = n.default.allAreas[r]), p.depth(a) < 1))
                                    return i;
                                for (let r = 0; r < a.piles.length; r++) {
                                    let l,
                                        s = p.getXOffset(a, r),
                                        d = p.getExtraXOffset(a, r, a.piles[r].length - 1);
                                    if (
                                        e >= s + d &&
                                        e <= s + (n.default.cardWidth + n.default.cardSpacing) + d
                                    ) {
                                        i.pile = o = r;
                                        for (let o = 0; o < a.piles[r].length; o++) {
                                            l =
                                                p.getYOffset(a, r) +
                                                p.setYOffset(a, o * a.cardYOffset[r]);
                                            let d = p.getExtraXOffset(a, r, o);
                                            t >= l &&
                                                t <=
                                                    l +
                                                        n.default.cardHeight +
                                                        n.default.cardSpacing &&
                                                null !== a.piles[r][o] &&
                                                ((i.card = a.piles[r][o]),
                                                (i.position = o),
                                                (i.offsets = { x: e - s - d, y: t - l }));
                                        }
                                    }
                                }
                            }
                        }
                        return (
                            'number' == typeof o && 0 == i.area.piles[o].length && (i.position = 0),
                            i
                        );
                    },
                    depth: e => {
                        let t = 1;
                        return Array.isArray(e.piles) && (t += p.depth(e.piles[0])), t;
                    },
                    resetCards: () => {
                        for (let e = 0; e < n.default.allAreas.length; e++)
                            for (let t = 0; t < n.default.allAreas[e].piles.length; t++)
                                for (let a = 0; a < n.default.allAreas[e].piles[t].length; a++)
                                    (n.default.allAreas[e].piles[t][a].hide = !1),
                                        (n.default.allAreas[e].piles[t][a].position = {});
                    },
                    draw: e => {
                        for (let t = 0; t < e.piles.length; t++) {
                            let a,
                                o = Math.floor(p.getXOffset(e, t)),
                                i = Math.floor(p.getYOffset(e, t));
                            if (
                                ((a = 'card_base'),
                                n.default.ctx.drawImage(
                                    n.default.images_canvas[a],
                                    o,
                                    i,
                                    Math.floor(n.default.cardWidth),
                                    Math.floor(n.default.cardHeight)
                                ),
                                'foundations' === e.name)
                            )
                                if (gameOfTheDay)
                                    n.default.ctx.drawImage(
                                        n.default.images_canvas.logo,
                                        o,
                                        i,
                                        n.default.cardWidth,
                                        n.default.cardHeight
                                    );
                                else {
                                    let e = 0.75 * n.default.cardWidth;
                                    n.default.ctx.drawImage(
                                        n.default.images_canvas.logo,
                                        o + (n.default.cardWidth - e) / 2,
                                        i + (n.default.cardHeight - e) / 2,
                                        Math.floor(e),
                                        Math.floor(e)
                                    );
                                }
                            for (let r = 0; r < e.piles[t].length && !e.piles[t][r].hide; r++) {
                                let l = Math.floor(p.setYOffset(e, r * e.cardYOffset[t]));
                                (a = e.piles[t][r].name),
                                    0 == e.piles[t][r].turnedup && (a = 'back_red');
                                const d = [e.name, e.piles[t][r].name, t, r].join('_');
                                if (s.default.highlightCard(d)) {
                                    let s = p.getExtraXOffset(e, t, r);
                                    n.default.ctx.save();
                                    let d = 0;
                                    for (; d < 4; )
                                        (n.default.ctx.shadowColor = '#52FF52'),
                                            (n.default.ctx.shadowBlur = 20),
                                            n.default.ctx.drawImage(
                                                n.default.images_canvas[a],
                                                o + s,
                                                i + l
                                            ),
                                            d++;
                                    n.default.ctx.restore();
                                } else {
                                    let s = n.default.cardWidth,
                                        d = o;
                                    e.piles[t][r].position.rotation &&
                                    e.piles[t][r].position.rotation < 0.5
                                        ? ((s =
                                              n.default.cardWidth -
                                              n.default.cardWidth *
                                                  (2 * e.piles[t][r].position.rotation)),
                                          (d =
                                              o +
                                              n.default.cardWidth *
                                                  e.piles[t][r].position.rotation))
                                        : e.piles[t][r].position.rotation &&
                                          e.piles[t][r].position.rotation >= 0.5 &&
                                          ((s =
                                              n.default.cardWidth *
                                              (2 * (e.piles[t][r].position.rotation - 0.5))),
                                          (a = e.piles[t][r].name),
                                          (d =
                                              o +
                                              n.default.cardWidth *
                                                  (1 - e.piles[t][r].position.rotation)));
                                    let f = p.getExtraXOffset(e, t, r);
                                    n.default.ctx.drawImage(
                                        n.default.images_canvas[a],
                                        Math.floor(d + f),
                                        Math.floor(i + l),
                                        Math.floor(s),
                                        Math.floor(n.default.cardHeight)
                                    );
                                }
                            }
                        }
                    },
                    getExtraXOffset: (e, t, a, o) => {
                        let n,
                            i = 0,
                            r = e.piles[t].length;
                        return (
                            void 0 !== o && (r = o),
                            (n = r <= 3 ? a : a < r - 3 ? 0 : a - (r - 3)),
                            n < 0 && (n = 0),
                            e.cardXOffset && e.cardXOffset[t] && (i = n * e.cardXOffset[t]),
                            i
                        );
                    },
                    drawFloat: () => {
                        for (let e = 0; e < n.default.float.length; e++) {
                            let t = n.default.float[e].name;
                            0 == n.default.float[e].turnedup && (t = 'back_red');
                            let a = n.default.cardWidth,
                                o = n.default.float[e].position.x;
                            void 0 !== n.default.float[e].position.rotation &&
                            n.default.float[e].position.rotation < 0.5
                                ? ((a =
                                      n.default.cardWidth -
                                      n.default.cardWidth *
                                          (2 * n.default.float[e].position.rotation)),
                                  (o =
                                      n.default.float[e].position.x +
                                      n.default.cardWidth * n.default.float[e].position.rotation),
                                  (t = 'back_red'))
                                : void 0 !== n.default.float[e].position.rotation &&
                                  n.default.float[e].position.rotation >= 0.5 &&
                                  ((a =
                                      n.default.cardWidth *
                                      (2 * (n.default.float[e].position.rotation - 0.5))),
                                  (t = n.default.float[e].name),
                                  (o =
                                      n.default.float[e].position.x +
                                      n.default.cardWidth *
                                          (1 - n.default.float[e].position.rotation)));
                            const i = n.default.float[e];
                            if (i.position.spin) {
                                const a = o,
                                    r = n.default.float[e].position.y,
                                    l = n.default.cardWidth,
                                    s = n.default.cardHeight,
                                    d = a + l / 2,
                                    f = r + s / 2;
                                n.default.ctx.translate(d, f),
                                    n.default.ctx.rotate(i.position.spin),
                                    n.default.ctx.drawImage(
                                        n.default.images_canvas[t],
                                        a - d,
                                        r - f,
                                        l,
                                        s
                                    ),
                                    n.default.ctx.rotate(-i.position.spin),
                                    n.default.ctx.translate(-d, -f);
                            } else
                                n.default.ctx.drawImage(
                                    n.default.images_canvas[t],
                                    Math.floor(o),
                                    Math.floor(n.default.float[e].position.y),
                                    Math.floor(a),
                                    Math.floor(n.default.cardHeight)
                                );
                        }
                    },
                    drawFlip: () => {
                        for (let e = 0; e < n.default.flip.length; e++) {
                            let t = n.default.flip[e].name;
                            0 == n.default.flip[e].turnedup && (t = 'back_red');
                            let a = n.default.cardWidth,
                                o = n.default.flip[e].position.x;
                            void 0 !== n.default.flip[e].position.rotation &&
                            n.default.flip[e].position.rotation < 0.5
                                ? ((a =
                                      n.default.cardWidth -
                                      n.default.cardWidth *
                                          (2 * n.default.flip[e].position.rotation)),
                                  (t = 'back_red'),
                                  (o =
                                      n.default.flip[e].position.x +
                                      n.default.cardWidth * n.default.flip[e].position.rotation))
                                : void 0 !== n.default.flip[e].position.rotation &&
                                  n.default.flip[e].position.rotation >= 0.5 &&
                                  ((a =
                                      n.default.cardWidth *
                                      (2 * (n.default.flip[e].position.rotation - 0.5))),
                                  (t = n.default.flip[e].name),
                                  (o =
                                      n.default.flip[e].position.x +
                                      n.default.cardWidth *
                                          (1 - n.default.flip[e].position.rotation))),
                                n.default.ctx.drawImage(
                                    n.default.images_canvas[t],
                                    Math.floor(o),
                                    Math.floor(n.default.flip[e].position.y),
                                    Math.floor(a),
                                    Math.floor(n.default.cardHeight)
                                );
                        }
                    },
                    randomNumber: (e, t) => Math.random() * (t - e) + e,
                    getPileWithLowestCard: e => {
                        let t,
                            a = !1;
                        for (let o = 0; o < e.piles.length; o++) {
                            if (void 0 === e.piles[o][e.piles[o].length - 1]) continue;
                            let n = e.piles[o][e.piles[o].length - 1].number;
                            (void 0 === t || t >= n) && ((t = n), (a = o));
                        }
                        return a;
                    },
                    finishGame: () => {
                        i.default.stop();
                        for (let e = 0; e < n.default.allAreas.length; e++) {
                            if (n.default.allAreas[e].gameWon) continue;
                            let t = p.getPileWithLowestCard(n.default.allAreas[e]);
                            if (!1 !== t && n.default.allAreas[e].piles[t].length > 0) {
                                n.default.float = n.default.allAreas[e].piles[t].slice(-1);
                                let a = p.getXOffset(n.default.allAreas[e], t),
                                    o = p.getYOffset(n.default.allAreas[e], t);
                                (n.default.float[0].position = { x: a, y: o }),
                                    (n.default.fromSet = {
                                        area: n.default.allAreas[e],
                                        pile: t,
                                        position: n.default.allAreas[e].piles[t].length - 1,
                                        card: n.default.float,
                                        offset: { x: a, y: o },
                                    });
                                let i = { x: a, y: o };
                                return l.default.click(i, n.default.fromSet);
                            }
                        }
                        p.waterfall();
                    },
                };
                addEventListener('gameVars.finishGameEvent', p.finishGame),
                    (p.waterfall = () => {
                        let e = gsap.timeline({
                            onStart: () => {
                                l.default.lock('waterfall'),
                                    n.default.isReplay || f.default.saveSeed();
                            },
                            onComplete: () => {
                                l.default.unlock('waterfall');
                            },
                        });
                        n.default.waterfallRunning = e;
                        let t,
                            a,
                            o,
                            i = !1;
                        for (let e = 0; e < n.default.allAreas.length; e++)
                            if (n.default.allAreas[e].gameWon)
                                for (let r = 0; r < n.default.allAreas[e].piles.length; r++)
                                    for (
                                        let l = n.default.allAreas[e].piles[r].length - 1;
                                        l >= 0;
                                        l--
                                    ) {
                                        (i = n.default.allAreas[e].piles[r].slice(-1).pop()),
                                            (t = e),
                                            (a = r),
                                            (o = l);
                                        break;
                                    }
                        if (!i) return !0;
                        (i.position = {
                            x: p.getXOffset(n.default.allAreas[t], a),
                            xMax: 0,
                            y: p.getYOffset(n.default.allAreas[t], o),
                            yMax: n.default.canvas.height - n.default.cardHeight,
                        }),
                            e.to(i.position, {
                                duration: n.default.getDeltaRatioDuration(1),
                                ease: 'power1.in',
                                x: i.position.xMax,
                                y: i.position.yMax,
                                onStart: () => {
                                    n.default.allAreas[t].piles[a].pop();
                                },
                                onUpdate: () => {
                                    n.default.ctx.drawImage(
                                        n.default.images_canvas[i.name],
                                        i.position.x,
                                        i.position.y
                                    );
                                },
                                onComplete: () => {
                                    let e = {
                                        card: i,
                                        periods: p.randomNumber(1, 4),
                                        amplitude: p.randomNumber(300, 1200),
                                        xPos: 0,
                                        yPos: n.default.canvas.height,
                                        rot: 0,
                                    };
                                    p.animateCardBounce(e);
                                },
                            });
                    }),
                    (p.turnCardsUp = e => {
                        let t = [];
                        l.default.lock('turnCardsUp');
                        for (let a = 0; a < n.default.allAreas.length; a++) {
                            let o = n.default.allAreas[a];
                            for (let a = 0; a < o.piles.length; a++)
                                for (let i = 0; i < o.piles[a].length; i++) {
                                    let l = { area: o, pile: a, position: i, card: o.piles[a][i] };
                                    if (
                                        ((n.default.fromSet = l),
                                        void 0 !== o.piles[a][i] &&
                                            0 === o.piles[a][i].turnedup &&
                                            d.default.can('flipUp', n.default.fromSet, l))
                                    ) {
                                        (o.piles[a][i].position.rotation = 0),
                                            (o.piles[a][i].position.rotationMax = 1),
                                            t.push(o.piles[a][i]);
                                        let n = { name: o.name, pile: a, position: i + 1 },
                                            l = { name: o.name, pile: a, position: i - 1 };
                                        (l.flipPosition = i),
                                            (l.flipTurnUpFrom = 0),
                                            (l.flipTurnUpTo = 1),
                                            (n.flipPosition = i),
                                            (n.flipTurnUpFrom = 1),
                                            (n.flipTurnUpTo = 0);
                                        let s = { to: n, from: l, triggerNextUndo: !0 };
                                        'deal' !== e && r.default.addUndo(s);
                                    }
                                }
                        }
                        p.drawGame();
                        let a = gsap.timeline({
                            onComplete: () => {
                                p.drawGame(),
                                    l.default.unlock('turnCardsUp'),
                                    'deal' == e &&
                                        (l.default.unlock('animateDeal'),
                                        window.dispatchEvent(n.default.dealAnimationFinished));
                            },
                        });
                        for (let e = 0; e < t.length; e++) {
                            let o = 0.2,
                                n = e / 10;
                            (0, c.isMobile)() && ((o = 0), (n = 0)),
                                a.to(
                                    t[e].position,
                                    {
                                        duration: o,
                                        ease: 'sine.inOut',
                                        rotation: t[e].position.rotationMax,
                                        onStart: () => {
                                            u.default.cardFlip();
                                        },
                                        onUpdate: () => {
                                            p.drawGame();
                                        },
                                        onComplete: () => {
                                            void 0 !== t[e] && (t[e].turnedup = 1);
                                        },
                                    },
                                    n
                                );
                        }
                    }),
                    (p.animateCardBounce = e => {
                        let t = 2 * Math.PI,
                            a = n.default.canvas.width / e.periods / t,
                            o = e.xPos,
                            i =
                                n.default.canvas.height -
                                Math.abs(e.amplitude * Math.sin(e.xPos / a));
                        n.default.ctx.save(),
                            n.default.ctx.translate(o, i - n.default.cardHeight / 2),
                            n.default.ctx.rotate(e.rot),
                            n.default.ctx.drawImage(
                                n.default.images_canvas[e.card.name],
                                -n.default.cardWidth / 2,
                                -n.default.cardHeight / 2,
                                n.default.cardWidth,
                                n.default.cardHeight
                            ),
                            n.default.ctx.restore(),
                            (e.xPos = o + 8),
                            (e.rot = e.xPos / a),
                            o <= n.default.canvas.width + n.default.cardHeight
                                ? (n.default.animationFrameRunning = window.requestAnimationFrame(
                                      p.animateCardBounce.bind(null, e)
                                  ))
                                : window.dispatchEvent(n.default.congratsNextCardEvent);
                    }),
                    (t.default = p);
            },
            4553: function (e, t, a) {
                'use strict';
                var o =
                    (this && this.__importDefault) ||
                    function (e) {
                        return e && e.__esModule ? e : { default: e };
                    };
                Object.defineProperty(t, '__esModule', { value: !0 });
                const n = a(1022),
                    i = o(a(7344));
                let r = {
                    setSpecificGameVars: e => {
                        r.specificGameVars = e;
                    },
                };
                (r.isTurnedUp = {
                    rule: e =>
                        !(
                            !r.isNotEmpty.rule(e) ||
                            (1 !== e.card.turnedup &&
                                ((i.default.flashMessage = 'Card needs to be face up.'), 1))
                        ),
                    explain: e => {
                        let t = 'Cards are face up and playable: ';
                        return (
                            (t += `${e.area.piles[e.pile]
                                .slice(e.position)
                                .map(n.convertCardToSymbolText)}`),
                            e.target.card &&
                                (t += `,${(0, n.convertCardToSymbolText)(e.target.card)}`),
                            t
                        );
                    },
                }),
                    (r.isTopCard = {
                        rule: e =>
                            !(
                                !r.isNotEmpty.rule(e) ||
                                (e.area.piles[e.pile].length - 1 != e.position &&
                                    ((i.default.flashMessage = 'Card needs to be on top.'), 1))
                            ),
                    }),
                    (r.targetIsOppositeColor = {
                        rule: e => {
                            if (!r.isNotEmpty.rule(e)) return !1;
                            let t =
                                    i.default.fromSet.area.piles[i.default.fromSet.pile][
                                        i.default.fromSet.position
                                    ].suit,
                                a = e.area.piles[e.pile][e.position].suit,
                                o = { diamond: 'red', heart: 'red', club: 'black', spade: 'black' };
                            return o[t] == o[a]
                                ? ((i.default.flashMessage =
                                      'Your card needs to be of the opposite suit color.'),
                                  !1)
                                : r.remainingSuitsAlternate.rule(i.default.fromSet);
                        },
                        explain: e =>
                            `${(0, n.convertCardToSymbolText)(e.card)} and ${(0,
                            n.convertCardToSymbolText)(e.target.card)} suits alternate color.`,
                    }),
                    (r.targetIsSameSuit = {
                        rule: e =>
                            !!r.isNotEmpty.rule(e) &&
                            (i.default.fromSet.area.piles[i.default.fromSet.pile][
                                i.default.fromSet.position
                            ].suit == e.area.piles[e.pile][e.position].suit ||
                                ((i.default.flashMessage =
                                    'Your card needs to be of the same suit.'),
                                !1)),
                        explain: e =>
                            `${(0, n.convertCardToSymbolText)(e.card)} and ${(0,
                            n.convertCardToSymbolText)(e.target.card)} are the same suit.`,
                    }),
                    (r.targetIsOneRankUp = {
                        rule: e =>
                            !!r.isNotEmpty.rule(e) &&
                            (i.default.fromSet.area.piles[i.default.fromSet.pile][
                                i.default.fromSet.position
                            ].number !==
                            e.area.piles[e.pile][e.position].number - 1
                                ? ((i.default.flashMessage =
                                      'Your card needs to be one rank down.'),
                                  !1)
                                : r.remainingRanksDecrement.rule(i.default.fromSet)),
                        explain: e =>
                            `${(0, n.convertCardToSymbolText)(
                                e.target.card
                            )} is one rank above ${(0, n.convertCardToSymbolText)(e.card)}.`,
                    }),
                    (r.targetIsOneRankDown = {
                        rule: e =>
                            !!r.isNotEmpty.rule(e) &&
                            (i.default.fromSet.area.piles[i.default.fromSet.pile][
                                i.default.fromSet.position
                            ].number ===
                                e.area.piles[e.pile][e.position].number + 1 ||
                                ((i.default.flashMessage = 'Your card needs to be one rank up.'),
                                !1)),
                        explain: e =>
                            `${(0, n.convertCardToSymbolText)(
                                e.target.card
                            )} is one rank below ${(0, n.convertCardToSymbolText)(e.card)}.`,
                    }),
                    (r.ifEmptyAndAce = {
                        rule: e =>
                            e.area.piles[e.pile].length > 0
                                ? ((i.default.flashMessage = 'Pile needs to be empty.'), !1)
                                : !(
                                      r.isEmpty.rule(i.default.fromSet) ||
                                      (1 !==
                                          i.default.fromSet.area.piles[i.default.fromSet.pile][
                                              i.default.fromSet.position
                                          ].number &&
                                          ((i.default.flashMessage =
                                              'Your card needs to be an Ace.'),
                                          1))
                                  ),
                    }),
                    (r.isEmpty = {
                        rule: e =>
                            0 == e.area.piles[e.pile].length ||
                            ((i.default.flashMessage = 'Pile needs to be empty.'), !1),
                    }),
                    (r.isNotEmpty = {
                        rule: e =>
                            !!(
                                e.area &&
                                e.card &&
                                e.area.piles[e.pile] &&
                                e.area.piles[e.pile][e.position]
                            ) || ((i.default.flashMessage = 'Pile cannot be empty.'), !1),
                    }),
                    (r.remainingSuitsAlternate = {
                        rule: () => {
                            let e = { diamond: 'red', heart: 'red', club: 'black', spade: 'black' },
                                t = i.default.fromSet.area.piles[i.default.fromSet.pile].slice(
                                    i.default.fromSet.position
                                ),
                                a = null;
                            for (let o = 0; o < t.length; o++)
                                if (null != a) {
                                    if (a == e[t[o].suit])
                                        return (
                                            (i.default.flashMessage =
                                                'All suit colors must alternate.'),
                                            !1
                                        );
                                    a = e[t[o].suit];
                                } else a = e[t[o].suit];
                            return !0;
                        },
                    }),
                    (r.remainingCardsTurnedUp = {
                        rule: () => {
                            for (let e = 0; e < i.default.fromSet.area.piles.length; e++)
                                for (let t = 0; t < i.default.fromSet.area.piles[e].length; t++)
                                    if (0 == i.default.fromSet.area.piles[e][t].turnedup) return !1;
                            return !0;
                        },
                    }),
                    (r.remainingCardsTurnedUpOnTarget = {
                        rule: e => {
                            for (let t = 0; t < e.area.piles.length; t++)
                                for (let a = 0; a < e.area.piles[t].length; a++)
                                    if (0 == e.area.piles[t][a].turnedup) return !1;
                            return !0;
                        },
                    }),
                    (r.remainingSuitsSame = {
                        rule: () => {
                            let e = i.default.fromSet.area.piles[i.default.fromSet.pile].slice(
                                    i.default.fromSet.position
                                ),
                                t = null;
                            for (let a = 0; a < e.length; a++)
                                if (null != t) {
                                    if (t !== e[a].suit)
                                        return (
                                            (i.default.flashMessage =
                                                'All suits must be the same.'),
                                            !1
                                        );
                                    t = e[a].suit;
                                } else t = e[a].suit;
                            return !0;
                        },
                    }),
                    (r.startsWithKingOrEmpty = {
                        rule: e =>
                            0 == e.area.piles[e.pile].length ||
                            13 == e.area.piles[e.pile][0].number,
                    }),
                    (r.remainingRanksDecrement = {
                        rule: () => {
                            let e = i.default.fromSet.area.piles[i.default.fromSet.pile].slice(
                                    i.default.fromSet.position
                                ),
                                t = null;
                            for (let a = 0; a < e.length; a++)
                                if (null != t) {
                                    if (t !== e[a].number + 1)
                                        return (
                                            (i.default.flashMessage =
                                                'Your cards must be sequenced from high to low one by one.'),
                                            !1
                                        );
                                    t = e[a].number;
                                } else t = e[a].number;
                            return !0;
                        },
                    }),
                    (r.forceFalse = { rule: () => !1 }),
                    (r.forceTrue = { rule: () => !0 }),
                    (r.targetIsLastCard = {
                        rule: e =>
                            e.area.piles[e.pile].length - 1 == e.position ||
                            ((i.default.flashMessage =
                                'Card can only be dropped on top card of a pile.'),
                            !1),
                    }),
                    (r.targetIsNotLastCard = {
                        rule: e => e.area.piles[e.pile].length - 1 != e.position,
                    }),
                    (r.freecellIsCorrectCount = {
                        rule: e => {
                            let t = i.default.fromSet.area.piles[i.default.fromSet.pile].slice(
                                i.default.fromSet.position
                            );
                            if (1 == t.length) return !0;
                            let a = 0;
                            for (let e = 0; e < r.specificGameVars.cellsArea.piles.length; e++)
                                0 == r.specificGameVars.cellsArea.piles[e].length && a++;
                            if (t.length <= a + 1) return !0;
                            let o = 0;
                            for (let t = 0; t < r.specificGameVars.tableauArea.piles.length; t++)
                                0 == r.specificGameVars.tableauArea.piles[t].length &&
                                    e.pile !== t &&
                                    o++;
                            const n = Math.pow(2, o) * (a + 1);
                            return (
                                t.length <= n ||
                                ((i.default.flashMessage =
                                    'Not enough empty cells or columns to drag cards. Can drag ' +
                                    n +
                                    ' at most.'),
                                !1)
                            );
                        },
                    }),
                    (r.fromIsLastCard = {
                        rule: () =>
                            i.default.fromSet.area.piles[i.default.fromSet.pile].length - 1 ==
                                i.default.fromSet.position ||
                            ((i.default.flashMessage = 'Only the last card can be dragged.'), !1),
                    }),
                    (r.fromIsKing = {
                        rule: () =>
                            13 == i.default.fromSet.card.number ||
                            ((i.default.flashMessage = 'Only the last card can be dragged.'), !1),
                    }),
                    (r.targetMaxOneCard = {
                        rule: e =>
                            !(
                                e.area.piles[e.pile].length > 0 &&
                                ((i.default.flashMessage = 'Pile can only hold one card.'), 1)
                            ),
                    }),
                    (t.default = r);
            },
            3558: function (e, t) {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 });
                const a = {
                    running: !1,
                    display: null,
                    results: null,
                    laps: [],
                    set: (e, t) => {
                        (a.display = e), (a.results = t), a.reset(), a.print();
                    },
                    reset: () => {
                        a.times = [0, 0, 0];
                    },
                    start: () => {
                        a.time || (a.time = performance.now()),
                            a.running || ((a.running = !0), requestAnimationFrame(a.step.bind(a)));
                    },
                    lap: () => {
                        const e = a.times,
                            t = document.createElement('li');
                        (t.innerText = a.format(e)), a.results.appendChild(t);
                    },
                    stop: () => {
                        if (a.running) return (a.running = !1), void (a.time = null);
                    },
                    restart: () => {
                        a.time || (a.time = performance.now()),
                            a.running || ((a.running = !0), requestAnimationFrame(a.step.bind(a))),
                            a.reset();
                    },
                    clear: () => {
                        a.clearChildren(a.results);
                    },
                    get: () => a.times,
                    update: (e, t, o) => {
                        (a.times[0] = parseInt(e)),
                            (a.times[1] = parseInt(t)),
                            (a.times[2] = parseInt(o));
                    },
                    step: e => {
                        a.running &&
                            (a.calculate(e),
                            (a.time = e),
                            a.print(),
                            requestAnimationFrame(a.step.bind(a)));
                    },
                    calculate: e => {
                        const t = e - a.time;
                        (a.times[2] += t / 10),
                            a.times[2] >= 100 && ((a.times[1] += 1), (a.times[2] -= 100)),
                            a.times[1] >= 60 && ((a.times[0] += 1), (a.times[1] -= 60));
                    },
                    print: () => {
                        a.display.innerText = a.format(a.times);
                    },
                    format: e => `      ${a.pad0(e[0], 2)}:      ${a.pad0(e[1], 2)}`,
                    pad0: (e, t) => {
                        let a = e.toString();
                        for (; a.length < t; --t) a = '0' + a;
                        return a;
                    },
                    clearChildren: e => {
                        for (; e.lastChild; ) e.removeChild(e.lastChild);
                    },
                };
                $('.timer-button').on('click', function () {
                    $(this).hasClass('playing')
                        ? ($('.timer-icon').html('&#9658;'),
                          $(this).removeClass('playing'),
                          a.stop())
                        : ($('.timer-icon').html('&#10073;&#10073;'),
                          $(this).addClass('playing'),
                          a.start());
                }),
                    (t.default = a);
            },
            3715: function (e, t, a) {
                'use strict';
                var o =
                    (this && this.__importDefault) ||
                    function (e) {
                        return e && e.__esModule ? e : { default: e };
                    };
                Object.defineProperty(t, '__esModule', { value: !0 });
                const n = o(a(7344)),
                    i = o(a(3558)),
                    r = o(a(6549));
                let l = {
                    start: () => {
                        if (!n.default.gameStarted) {
                            n.default.gameStarted = !0;
                            let e = { seed: seed, game: nameSlug };
                            $.post('/high-scores/create', e, function (e) {
                                (window.gameId = e.id), r.default.setLabel(window.gameId);
                            });
                        }
                        i.default.start(),
                            $('.timer-icon').html('&#10073;&#10073;'),
                            $('.timer-button').addClass('playing');
                    },
                };
                (l.restart = () => {
                    $('.timer-icon').html('&#9658;'),
                        $(this).removeClass('playing'),
                        i.default.restart();
                }),
                    (l.stop = () => {
                        $('.timer-icon').html('&#9658;'),
                            $(this).removeClass('playing'),
                            i.default.stop();
                    }),
                    (l.hide = () => {
                        $('.timer-icon').hide(), $('.timer-button').hide();
                    }),
                    (t.default = l);
            },
            8027: function (e, t, a) {
                'use strict';
                var o =
                    (this && this.__importDefault) ||
                    function (e) {
                        return e && e.__esModule ? e : { default: e };
                    };
                Object.defineProperty(t, '__esModule', { value: !0 });
                const n = o(a(7344)),
                    i = {
                        ruleBook: {},
                        setRuleBook: e => {
                            i.ruleBook = e;
                        },
                        can: (e, t, a) => {
                            i.clearFlashMessage();
                            let o = [];
                            if (!a.area || 'number' != typeof a.pile) return !1;
                            if (!t.card) return !1;
                            if (void 0 === i.ruleBook[e]) return !1;
                            for (let t = 0; t < i.ruleBook[e][a.area.name].length; t++) {
                                let n = !0;
                                for (let r = 0; r < i.ruleBook[e][a.area.name][t].length; r++)
                                    i.ruleBook[e][a.area.name][t][r].rule(a)
                                        ? o.push(i.ruleBook[e][a.area.name][t][r])
                                        : (n = !1);
                                if (n) return o;
                            }
                            return !1;
                        },
                        ruleExists: e => void 0 !== i.ruleBook[e],
                        areCardsPrepared: () => {
                            let e = !0;
                            for (let t = 0; t < n.default.allAreas.length; t++)
                                if (!n.default.allAreas[t].gameWon)
                                    for (let a = 0; a < n.default.allAreas[t].piles.length; a++) {
                                        let o = !1;
                                        n.default.allAreas[t].piles[a].length > 0 &&
                                            (o = n.default.allAreas[t].piles[a][0]);
                                        let r = {
                                            area: n.default.allAreas[t],
                                            card: o,
                                            pile: a,
                                            position: 0,
                                        };
                                        i.can('win', n.default.fromSet, r) || (e = !1);
                                    }
                            return !!e;
                        },
                        hasGameBeenWon: () => {
                            if (i.areCardsPrepared()) return !0;
                            for (let e = 0; e < n.default.allAreas.length; e++)
                                if (n.default.allAreas[e].gameWon) {
                                    for (let t = 0; t < n.default.allAreas[e].piles.length; t++)
                                        if (13 != n.default.allAreas[e].piles[t].length) return !1;
                                    return !0;
                                }
                        },
                        clearFlashMessage: () => {
                            n.default.flashMessage = '';
                        },
                        showFlashMessage: e => {
                            n.default.flashMessage.length > 0 &&
                                ($('#gameStatusMessage .alert').html(
                                    'Cannot ' + e + ': ' + n.default.flashMessage
                                ),
                                $('#gameStatusMessage').show().delay(2e3).fadeOut(),
                                i.clearFlashMessage());
                        },
                    };
                t.default = i;
            },
            1022: function (e, t, a) {
                'use strict';
                var o =
                    (this && this.__importDefault) ||
                    function (e) {
                        return e && e.__esModule ? e : { default: e };
                    };
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    (t.isMobile =
                        t.modalOnScreen =
                        t.checkTestBucket =
                        t.convertCardToSymbolText =
                        t.onIdle =
                        t.halfDayDateDiff =
                        t.dateDiff =
                        t.isStagingEnv =
                        t.isDebug =
                        t.isLocalEnv =
                            void 0);
                const n = o(a(8492));
                (t.isLocalEnv = function () {
                    var e, t;
                    return (
                        'localhost' ===
                            (null ===
                                (e =
                                    null === window || void 0 === window
                                        ? void 0
                                        : window.location) || void 0 === e
                                ? void 0
                                : e.hostname) ||
                        'local.solitaired.com' ===
                            (null ===
                                (t =
                                    null === window || void 0 === window
                                        ? void 0
                                        : window.location) || void 0 === t
                                ? void 0
                                : t.hostname)
                    );
                }),
                    (t.isDebug = function () {
                        return null === window || void 0 === window
                            ? void 0
                            : window.location.href.includes('debug=true');
                    }),
                    (t.isStagingEnv = function () {
                        var e;
                        return (
                            'dev.solitaired.com' ===
                            (null ===
                                (e =
                                    null === window || void 0 === window
                                        ? void 0
                                        : window.location) || void 0 === e
                                ? void 0
                                : e.hostname)
                        );
                    }),
                    (t.dateDiff = function (e, t) {
                        return Math.ceil((t - e) / 864e5);
                    }),
                    (t.halfDayDateDiff = function (e, t) {
                        const a = new Date(e),
                            o = new Date(t).setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0);
                        return Math.ceil(o / 432e5);
                    }),
                    (t.onIdle = function (e, t) {
                        let a;
                        e = e || 3e4;
                        const o = () => {
                                clearTimeout(a),
                                    (a = setTimeout(() => {
                                        t();
                                    }, e));
                            },
                            i = (0, n.default)(o, 1e3, { leading: !0, maxWait: 1e3, trailing: !1 });
                        $(() => {
                            i(),
                                $(document).on('mousemove', i),
                                $(document).on('keypress', o),
                                $(document).on('mousedown', o),
                                $(document).on('touchstart', o),
                                $(document).on('touchmove', i);
                        });
                    });
                const i = {
                        heart: '&hearts;',
                        diamond: '&diams;',
                        club: '&clubs;',
                        spade: '&spades;',
                    },
                    r = {
                        1: 'A',
                        2: 2,
                        3: 3,
                        4: 4,
                        5: 5,
                        6: 6,
                        7: 7,
                        8: 8,
                        9: 9,
                        10: 10,
                        11: 'J',
                        12: 'Q',
                        13: 'K',
                    },
                    l = { heart: '#ff0000', diamond: '#ff0000', club: '#000000', spade: '#000000' };
                (t.convertCardToSymbolText = function (e) {
                    let t = (e = 'string' == typeof e ? e : e.name).split('_');
                    return `<span style="color: ${l[t[0]]}">${i[t[0]]}</span><span style="color: ${
                        l[t[0]]
                    }">${r[t[1]]}</span>`;
                }),
                    (t.checkTestBucket = function (e, t) {
                        return (
                            !!(
                                'undefined' != typeof abTest &&
                                abTest.run &&
                                abTest.name &&
                                abTest.name.length > 0
                            ) &&
                            ('number' != typeof t
                                ? e === abTest.name
                                : e === abTest.name && t === abTest.bucket)
                        );
                    }),
                    (t.modalOnScreen = function () {
                        return $('.modal, #congrats')
                            .toArray()
                            .some(e => 'none' != window.getComputedStyle(e).display);
                    }),
                    (t.isMobile = function () {
                        return window.innerWidth < 430;
                    });
            },
            7344: function (e, t) {
                'use strict';
                Object.defineProperty(t, '__esModule', { value: !0 }),
                    gsap.ticker.lagSmoothing(0),
                    location.href.indexOf('showDeltaRatio=true') > -1 &&
                        gsap.ticker.add(function () {
                            console.log('FPS delay ratio: ' + gsap.ticker.deltaRatio());
                        });
                let a = {
                    dispatch: e => {
                        setTimeout(() => {
                            window.dispatchEvent(e);
                        }, 0);
                    },
                    finishGameEvent: new Event('gameVars.finishGameEvent'),
                    images_canvas: {},
                    waterfallRunning: !1,
                    globalWindow: {},
                    imageQueue: 0,
                };
                (a.imagesLoaded = new Event('gameVars.imagesLoaded')),
                    (a.congratsNextCardEvent = new Event('gameVars.congratsNextCardEvent')),
                    (a.animateDeal = new Event('gameVars.animateDeal')),
                    (a.dealAnimationFinished = new Event('gameVars.dealAnimationFinished')),
                    (a.dropCompleted = new Event('gameVars.dropCompleted')),
                    (a.triggerNextUndo = new Event('gameVars.triggerNextUndo')),
                    (a.gameWonEvent = new Event('gameVars.gameWonEvent')),
                    (a.isNewGame = !0),
                    a.clickStart,
                    a.cardWidth,
                    a.cardHeight,
                    a.cardSpacing,
                    a.cardStep,
                    (a.cardXOffset = 0),
                    a.moveCounter,
                    a.cardsSprite,
                    (a.flashMessage = ''),
                    (a.gameStarted = !1),
                    (a.previousMoves = []),
                    (a.cardFactors = {
                        spacing: 0.03,
                        width: 0.69,
                        height: factorHeight,
                        stepMax: 0.175,
                    }),
                    (a.float = []),
                    (a.flip = []),
                    (a.fromSet = {}),
                    (a.turns = 0),
                    (a.passthroughs = 0),
                    (a.stockCount = 0),
                    (a.gameWon = !1),
                    (a.lock = {}),
                    (a.softLock = {}),
                    (a.images = {}),
                    (a.canvas = document.getElementById('canvas')),
                    (a.ctx = a.canvas.getContext('2d')),
                    'string' == typeof seed &&
                        'string' == typeof nameSlug &&
                        (a.storageKey = `moves-${nameSlug}-${seed}`),
                    (a.getDeltaRatioDuration = e => (gsap.ticker.deltaRatio() > 3 ? 0 : e)),
                    (a.getCleanCards = () => {
                        let e = [];
                        for (let t in a.allAreas)
                            for (let o in a.allAreas[t].piles)
                                for (let n in a.allAreas[t].piles[o])
                                    e.push(a.allAreas[t].piles[o][n].name);
                        return e;
                    }),
                    (a.getAllCards = () => {
                        let e = [];
                        e.push(a.float);
                        for (let t = 0; t < a.allAreas.length; t++) e.push(a.allAreas[t].piles);
                        return e;
                    }),
                    (t.default = a),
                    (window.getCleanCards = a.getCleanCards),
                    (window.getLocks = function () {
                        return JSON.stringify(a.lock);
                    });
            },
        },
        t = {};
    function a(o) {
        var n = t[o];
        if (void 0 !== n) return n.exports;
        var i = (t[o] = { exports: {} });
        return e[o].call(i.exports, i, i.exports, a), i.exports;
    }
    (a.n = function (e) {
        var t =
            e && e.__esModule
                ? function () {
                      return e.default;
                  }
                : function () {
                      return e;
                  };
        return a.d(t, { a: t }), t;
    }),
        (a.d = function (e, t) {
            for (var o in t)
                a.o(t, o) &&
                    !a.o(e, o) &&
                    Object.defineProperty(e, o, { enumerable: !0, get: t[o] });
        }),
        (a.g = (function () {
            if ('object' == typeof globalThis) return globalThis;
            try {
                return this || new Function('return this')();
            } catch (e) {
                if ('object' == typeof window) return window;
            }
        })()),
        (a.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }),
        (a.r = function (e) {
            'undefined' != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
                Object.defineProperty(e, '__esModule', { value: !0 });
        }),
        (function () {
            'use strict';
            var e = a(3558),
                t = a(7344),
                o = a(7176),
                n = a.n(o),
                i = a(3715),
                r = a.n(i),
                l = a(6739),
                s = a(2924),
                d = a(5401),
                f = a(5213),
                u = a.n(f),
                c = a(8021),
                p = a(4553),
                m = a.n(p),
                g = a(8027),
                h = a.n(g),
                v = a(9226);
            let w = {};
            (w.customizeCardBack = n().replaceCardBack),
                (w.updateCardFactors = n().updateCardFactors),
                (w.redrawImages = n().redrawImages),
                (w.drawGame = n().drawGame),
                (w.sizeToFit = function () {
                    n().sizeToFit(), n().redrawImages();
                });
            var y = w,
                b = a(1022),
                S = a(5158),
                x = a(9745);
            function k() {
                k = function () {
                    return e;
                };
                var e = {},
                    t = Object.prototype,
                    a = t.hasOwnProperty,
                    o =
                        Object.defineProperty ||
                        function (e, t, a) {
                            e[t] = a.value;
                        },
                    n = 'function' == typeof Symbol ? Symbol : {},
                    i = n.iterator || '@@iterator',
                    r = n.asyncIterator || '@@asyncIterator',
                    l = n.toStringTag || '@@toStringTag';
                function s(e, t, a) {
                    return (
                        Object.defineProperty(e, t, {
                            value: a,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                        }),
                        e[t]
                    );
                }
                try {
                    s({}, '');
                } catch (e) {
                    s = function (e, t, a) {
                        return (e[t] = a);
                    };
                }
                function d(e, t, a, n) {
                    var i = t && t.prototype instanceof c ? t : c,
                        r = Object.create(i.prototype),
                        l = new A(n || []);
                    return o(r, '_invoke', { value: S(e, a, l) }), r;
                }
                function f(e, t, a) {
                    try {
                        return { type: 'normal', arg: e.call(t, a) };
                    } catch (e) {
                        return { type: 'throw', arg: e };
                    }
                }
                e.wrap = d;
                var u = {};
                function c() {}
                function p() {}
                function m() {}
                var g = {};
                s(g, i, function () {
                    return this;
                });
                var h = Object.getPrototypeOf,
                    v = h && h(h(M([])));
                v && v !== t && a.call(v, i) && (g = v);
                var w = (m.prototype = c.prototype = Object.create(g));
                function y(e) {
                    ['next', 'throw', 'return'].forEach(function (t) {
                        s(e, t, function (e) {
                            return this._invoke(t, e);
                        });
                    });
                }
                function b(e, t) {
                    function n(o, i, r, l) {
                        var s = f(e[o], e, i);
                        if ('throw' !== s.type) {
                            var d = s.arg,
                                u = d.value;
                            return u && 'object' == typeof u && a.call(u, '__await')
                                ? t.resolve(u.__await).then(
                                      function (e) {
                                          n('next', e, r, l);
                                      },
                                      function (e) {
                                          n('throw', e, r, l);
                                      }
                                  )
                                : t.resolve(u).then(
                                      function (e) {
                                          (d.value = e), r(d);
                                      },
                                      function (e) {
                                          return n('throw', e, r, l);
                                      }
                                  );
                        }
                        l(s.arg);
                    }
                    var i;
                    o(this, '_invoke', {
                        value: function (e, a) {
                            function o() {
                                return new t(function (t, o) {
                                    n(e, a, t, o);
                                });
                            }
                            return (i = i ? i.then(o, o) : o());
                        },
                    });
                }
                function S(e, t, a) {
                    var o = 'suspendedStart';
                    return function (n, i) {
                        if ('executing' === o) throw new Error('Generator is already running');
                        if ('completed' === o) {
                            if ('throw' === n) throw i;
                            return { value: void 0, done: !0 };
                        }
                        for (a.method = n, a.arg = i; ; ) {
                            var r = a.delegate;
                            if (r) {
                                var l = x(r, a);
                                if (l) {
                                    if (l === u) continue;
                                    return l;
                                }
                            }
                            if ('next' === a.method) a.sent = a._sent = a.arg;
                            else if ('throw' === a.method) {
                                if ('suspendedStart' === o) throw ((o = 'completed'), a.arg);
                                a.dispatchException(a.arg);
                            } else 'return' === a.method && a.abrupt('return', a.arg);
                            o = 'executing';
                            var s = f(e, t, a);
                            if ('normal' === s.type) {
                                if (((o = a.done ? 'completed' : 'suspendedYield'), s.arg === u))
                                    continue;
                                return { value: s.arg, done: a.done };
                            }
                            'throw' === s.type &&
                                ((o = 'completed'), (a.method = 'throw'), (a.arg = s.arg));
                        }
                    };
                }
                function x(e, t) {
                    var a = e.iterator[t.method];
                    if (void 0 === a) {
                        if (((t.delegate = null), 'throw' === t.method)) {
                            if (
                                e.iterator.return &&
                                ((t.method = 'return'),
                                (t.arg = void 0),
                                x(e, t),
                                'throw' === t.method)
                            )
                                return u;
                            (t.method = 'throw'),
                                (t.arg = new TypeError(
                                    "The iterator does not provide a 'throw' method"
                                ));
                        }
                        return u;
                    }
                    var o = f(a, e.iterator, t.arg);
                    if ('throw' === o.type)
                        return (t.method = 'throw'), (t.arg = o.arg), (t.delegate = null), u;
                    var n = o.arg;
                    return n
                        ? n.done
                            ? ((t[e.resultName] = n.value),
                              (t.next = e.nextLoc),
                              'return' !== t.method && ((t.method = 'next'), (t.arg = void 0)),
                              (t.delegate = null),
                              u)
                            : n
                        : ((t.method = 'throw'),
                          (t.arg = new TypeError('iterator result is not an object')),
                          (t.delegate = null),
                          u);
                }
                function C(e) {
                    var t = { tryLoc: e[0] };
                    1 in e && (t.catchLoc = e[1]),
                        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
                        this.tryEntries.push(t);
                }
                function T(e) {
                    var t = e.completion || {};
                    (t.type = 'normal'), delete t.arg, (e.completion = t);
                }
                function A(e) {
                    (this.tryEntries = [{ tryLoc: 'root' }]), e.forEach(C, this), this.reset(!0);
                }
                function M(e) {
                    if (e) {
                        var t = e[i];
                        if (t) return t.call(e);
                        if ('function' == typeof e.next) return e;
                        if (!isNaN(e.length)) {
                            var o = -1,
                                n = function t() {
                                    for (; ++o < e.length; )
                                        if (a.call(e, o)) return (t.value = e[o]), (t.done = !1), t;
                                    return (t.value = void 0), (t.done = !0), t;
                                };
                            return (n.next = n);
                        }
                    }
                    return { next: O };
                }
                function O() {
                    return { value: void 0, done: !0 };
                }
                return (
                    (p.prototype = m),
                    o(w, 'constructor', { value: m, configurable: !0 }),
                    o(m, 'constructor', { value: p, configurable: !0 }),
                    (p.displayName = s(m, l, 'GeneratorFunction')),
                    (e.isGeneratorFunction = function (e) {
                        var t = 'function' == typeof e && e.constructor;
                        return (
                            !!t && (t === p || 'GeneratorFunction' === (t.displayName || t.name))
                        );
                    }),
                    (e.mark = function (e) {
                        return (
                            Object.setPrototypeOf
                                ? Object.setPrototypeOf(e, m)
                                : ((e.__proto__ = m), s(e, l, 'GeneratorFunction')),
                            (e.prototype = Object.create(w)),
                            e
                        );
                    }),
                    (e.awrap = function (e) {
                        return { __await: e };
                    }),
                    y(b.prototype),
                    s(b.prototype, r, function () {
                        return this;
                    }),
                    (e.AsyncIterator = b),
                    (e.async = function (t, a, o, n, i) {
                        void 0 === i && (i = Promise);
                        var r = new b(d(t, a, o, n), i);
                        return e.isGeneratorFunction(a)
                            ? r
                            : r.next().then(function (e) {
                                  return e.done ? e.value : r.next();
                              });
                    }),
                    y(w),
                    s(w, l, 'Generator'),
                    s(w, i, function () {
                        return this;
                    }),
                    s(w, 'toString', function () {
                        return '[object Generator]';
                    }),
                    (e.keys = function (e) {
                        var t = Object(e),
                            a = [];
                        for (var o in t) a.push(o);
                        return (
                            a.reverse(),
                            function e() {
                                for (; a.length; ) {
                                    var o = a.pop();
                                    if (o in t) return (e.value = o), (e.done = !1), e;
                                }
                                return (e.done = !0), e;
                            }
                        );
                    }),
                    (e.values = M),
                    (A.prototype = {
                        constructor: A,
                        reset: function (e) {
                            if (
                                ((this.prev = 0),
                                (this.next = 0),
                                (this.sent = this._sent = void 0),
                                (this.done = !1),
                                (this.delegate = null),
                                (this.method = 'next'),
                                (this.arg = void 0),
                                this.tryEntries.forEach(T),
                                !e)
                            )
                                for (var t in this)
                                    't' === t.charAt(0) &&
                                        a.call(this, t) &&
                                        !isNaN(+t.slice(1)) &&
                                        (this[t] = void 0);
                        },
                        stop: function () {
                            this.done = !0;
                            var e = this.tryEntries[0].completion;
                            if ('throw' === e.type) throw e.arg;
                            return this.rval;
                        },
                        dispatchException: function (e) {
                            if (this.done) throw e;
                            var t = this;
                            function o(a, o) {
                                return (
                                    (r.type = 'throw'),
                                    (r.arg = e),
                                    (t.next = a),
                                    o && ((t.method = 'next'), (t.arg = void 0)),
                                    !!o
                                );
                            }
                            for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                                var i = this.tryEntries[n],
                                    r = i.completion;
                                if ('root' === i.tryLoc) return o('end');
                                if (i.tryLoc <= this.prev) {
                                    var l = a.call(i, 'catchLoc'),
                                        s = a.call(i, 'finallyLoc');
                                    if (l && s) {
                                        if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
                                        if (this.prev < i.finallyLoc) return o(i.finallyLoc);
                                    } else if (l) {
                                        if (this.prev < i.catchLoc) return o(i.catchLoc, !0);
                                    } else {
                                        if (!s)
                                            throw new Error(
                                                'try statement without catch or finally'
                                            );
                                        if (this.prev < i.finallyLoc) return o(i.finallyLoc);
                                    }
                                }
                            }
                        },
                        abrupt: function (e, t) {
                            for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                                var n = this.tryEntries[o];
                                if (
                                    n.tryLoc <= this.prev &&
                                    a.call(n, 'finallyLoc') &&
                                    this.prev < n.finallyLoc
                                ) {
                                    var i = n;
                                    break;
                                }
                            }
                            i &&
                                ('break' === e || 'continue' === e) &&
                                i.tryLoc <= t &&
                                t <= i.finallyLoc &&
                                (i = null);
                            var r = i ? i.completion : {};
                            return (
                                (r.type = e),
                                (r.arg = t),
                                i
                                    ? ((this.method = 'next'), (this.next = i.finallyLoc), u)
                                    : this.complete(r)
                            );
                        },
                        complete: function (e, t) {
                            if ('throw' === e.type) throw e.arg;
                            return (
                                'break' === e.type || 'continue' === e.type
                                    ? (this.next = e.arg)
                                    : 'return' === e.type
                                    ? ((this.rval = this.arg = e.arg),
                                      (this.method = 'return'),
                                      (this.next = 'end'))
                                    : 'normal' === e.type && t && (this.next = t),
                                u
                            );
                        },
                        finish: function (e) {
                            for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                                var a = this.tryEntries[t];
                                if (a.finallyLoc === e)
                                    return this.complete(a.completion, a.afterLoc), T(a), u;
                            }
                        },
                        catch: function (e) {
                            for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                                var a = this.tryEntries[t];
                                if (a.tryLoc === e) {
                                    var o = a.completion;
                                    if ('throw' === o.type) {
                                        var n = o.arg;
                                        T(a);
                                    }
                                    return n;
                                }
                            }
                            throw new Error('illegal catch attempt');
                        },
                        delegateYield: function (e, t, a) {
                            return (
                                (this.delegate = { iterator: M(e), resultName: t, nextLoc: a }),
                                'next' === this.method && (this.arg = void 0),
                                u
                            );
                        },
                    }),
                    e
                );
            }
            function C(e, t, a, o, n, i, r) {
                try {
                    var l = e[i](r),
                        s = l.value;
                } catch (e) {
                    return void a(e);
                }
                l.done ? t(s) : Promise.resolve(s).then(o, n);
            }
            function T(e) {
                return function () {
                    var t = this,
                        a = arguments;
                    return new Promise(function (o, n) {
                        var i = e.apply(t, a);
                        function r(e) {
                            C(i, o, n, r, l, 'next', e);
                        }
                        function l(e) {
                            C(i, o, n, r, l, 'throw', e);
                        }
                        r(void 0);
                    });
                };
            }
            let A = {
                    drag: {
                        tableau: [
                            [
                                m().isTurnedUp,
                                m().remainingRanksDecrement,
                                m().remainingSuitsAlternate,
                            ],
                        ],
                        foundations: [[m().isNotEmpty, m().fromIsLastCard]],
                        stock: [],
                        waste: [[m().isTurnedUp, m().fromIsLastCard]],
                    },
                    drop: {
                        tableau: [
                            [m().isEmpty, m().fromIsKing],
                            [
                                m().isTurnedUp,
                                m().targetIsOneRankUp,
                                m().targetIsOppositeColor,
                                m().targetIsLastCard,
                            ],
                        ],
                        foundations: [
                            [m().ifEmptyAndAce, m().fromIsLastCard],
                            [m().targetIsSameSuit, m().targetIsOneRankDown, m().fromIsLastCard],
                        ],
                        stock: [],
                        waste: [],
                    },
                    win: {
                        tableau: [
                            [
                                m().remainingCardsTurnedUpOnTarget,
                                m().remainingRanksDecrement,
                                m().remainingSuitsAlternate,
                            ],
                            [m().isEmpty],
                        ],
                        foundations: [],
                        stock: [[m().isEmpty]],
                        waste: [[m().isEmpty]],
                    },
                    flipUp: {
                        tableau: [[m().targetIsLastCard]],
                        foundations: [[m().forceTrue]],
                        stock: [[m().forceFalse]],
                        waste: [[m().forceTrue]],
                    },
                },
                M = {
                    stock: [[]],
                    waste: [[]],
                    foundations: [[], [], [], []],
                    piles: [[], [], [], [], [], [], []],
                };
            (M.stockArea = {
                name: 'stock',
                piles: M.stock,
                offset: { x: 0, y: 0 },
                mobileOffset: { x: 6, y: 0 },
                orientation: { x: 1, y: 0 },
                collapse: !0,
                fromWeight: -1e4,
                toWeight: -1e4,
                cardYOffset: [0],
                distribution: [24],
            }),
                (M.wasteArea = {
                    name: 'waste',
                    piles: M.waste,
                    offset: { x: 1, y: 0 },
                    mobileOffset: { x: 5, y: 0 },
                    orientation: { x: 1, y: 0 },
                    collapse: !0,
                    fromWeight: -1e4,
                    toWeight: -1e4,
                    cardYOffset: [0],
                    cardXOffset: [0],
                    distribution: [0],
                }),
                (M.foundationsArea = {
                    name: 'foundations',
                    piles: M.foundations,
                    offset: { x: 3, y: 0 },
                    mobileOffset: { x: 0, y: 0 },
                    orientation: { x: 1, y: 0 },
                    collapse: !0,
                    gameWon: !0,
                    fromWeight: 100,
                    toWeight: 100,
                    cardYOffset: [0, 0, 0, 0],
                    distribution: [0, 0, 0, 0],
                }),
                (M.tableauArea = {
                    name: 'tableau',
                    piles: M.piles,
                    offset: { x: 0, y: 1 },
                    mobileOffset: { x: 0, y: 1 },
                    orientation: { x: 1, y: 0 },
                    collapse: !1,
                    fromWeight: 60,
                    toWeight: 60,
                    distribution: [1, 2, 3, 4, 5, 6, 7],
                    cardYOffset: [0, 0, 0, 0, 0, 0, 0],
                    legacyDistribution: [
                        [2, 1, 1, 1, 1, 1, 1],
                        [0, 2, 1, 1, 1, 1, 1],
                        [0, 0, 2, 1, 1, 1, 1],
                        [0, 0, 0, 2, 1, 1, 1],
                        [0, 0, 0, 0, 2, 1, 1],
                        [0, 0, 0, 0, 0, 2, 1],
                        [0, 0, 0, 0, 0, 0, 2],
                    ],
                }),
                3 == numTurns &&
                    ((M.wasteArea.cardXOffset = [50]), (M.wasteArea.mobileOffset.x = 4.5)),
                (0, b.isMobile)() &&
                    'left' == handMode &&
                    ((M.wasteArea.mobileOffset.x = 1),
                    (M.stockArea.mobileOffset.x = 0),
                    (M.foundationsArea.mobileOffset.x = 3)),
                (t.default.allAreas = [M.tableauArea, M.foundationsArea, M.stockArea, M.wasteArea]);
            let O = function (e) {
                e &&
                    ((stock = []),
                    ['club', 'diamond', 'heart', 'spade'].forEach(function (e) {
                        for (let t = 1; t <= 13; t++)
                            stock.push({
                                name: e + '_' + t,
                                suit: e,
                                number: t,
                                turnedup: 0,
                                hide: 0,
                            });
                    }),
                    (M.stock = [[]]),
                    (M.waste = [[]]),
                    (M.foundations = [[], [], [], []]),
                    (M.piles = [[], [], [], [], [], [], []]),
                    (M.stockArea.piles = M.stock),
                    (M.wasteArea.piles = M.waste),
                    (M.foundationsArea.piles = M.foundations),
                    (M.tableauArea.piles = M.piles),
                    (P = !1)),
                    n().draw(M.stockArea),
                    n().draw(M.wasteArea),
                    n().draw(M.foundationsArea);
                const t = s.Z.shuffle(),
                    a = [
                        s.Z.deal(M.foundationsArea, t.foundations),
                        s.Z.deal(M.wasteArea, t.waste),
                        s.Z.deal(M.tableauArea, t.tableau),
                        s.Z.deal(M.stockArea, t.stock),
                    ];
                Promise.all(a).then(function () {
                    n().turnCardsUp('deal');
                }),
                    n().drawGame();
            };
            (window.newGame = O),
                (n().drawGame = function (e) {
                    if (e) {
                        if (!t.default.waterfallRunning) {
                            if (t.default.isNewGame) return (t.default.isNewGame = !1), void O();
                            if (
                                ((t.default.needsRedraw = !1),
                                t.default.ctx.clearRect(
                                    0,
                                    0,
                                    t.default.canvas.width,
                                    t.default.canvas.height
                                ),
                                0 == M.stockArea.piles[0].length && M.wasteArea.piles[0].length > 0)
                            ) {
                                let e = Math.floor(n().getXOffset(M.stockArea, 0)),
                                    a = Math.floor(n().getYOffset(M.stockArea, 0));
                                (t.default.ctx.font =
                                    'bold ' + 0.5 * t.default.cardWidth + 'px sans-serif'),
                                    (t.default.ctx.fillStyle = 'rgba(0,0,0,0.3)'),
                                    t.default.ctx.fillText(
                                        '↺',
                                        e + 0.35 * t.default.cardWidth,
                                        a + t.default.cardHeight / 2
                                    ),
                                    (t.default.ctx.font =
                                        'bold ' + 0.1 * t.default.cardWidth + 'px sans-serif'),
                                    t.default.ctx.fillText(
                                        'REDEAL',
                                        e + 0.29 * t.default.cardWidth,
                                        a + t.default.cardHeight / 2 + t.default.cardHeight / 8
                                    );
                            }
                            if (
                                M.stockArea.piles[0].length > 0 &&
                                0 == M.wasteArea.piles[0].length &&
                                !(0, b.isMobile)() &&
                                !n().isTabletPortrait()
                            ) {
                                let e = Math.floor(n().getXOffset(M.wasteArea, 0)),
                                    a = Math.floor(n().getYOffset(M.wasteArea, 0));
                                (t.default.ctx.fillStyle = 'rgba(0,0,0,0.3)'),
                                    (t.default.ctx.font =
                                        'bold ' + 0.1 * t.default.cardWidth + 'px sans-serif'),
                                    (t.default.ctx.fillStyle = 'rgba(0,0,0,0.75)'),
                                    t.default.ctx.fillText(
                                        'Press SPACE',
                                        e + 0.15 * t.default.cardWidth,
                                        a + t.default.cardHeight / 4
                                    ),
                                    t.default.ctx.fillText(
                                        'To Flip',
                                        e + 0.3 * t.default.cardWidth,
                                        a + t.default.cardHeight / 4 + t.default.cardHeight / 8
                                    ),
                                    t.default.ctx.fillText(
                                        'Press ?',
                                        e + 0.25 * t.default.cardWidth,
                                        a + (3 * t.default.cardHeight) / 4
                                    ),
                                    t.default.ctx.fillText(
                                        'for shortcuts',
                                        e + 0.15 * t.default.cardWidth,
                                        a +
                                            (3 * t.default.cardHeight) / 4 +
                                            t.default.cardHeight / 8
                                    );
                            }
                            (t.default.ctx.globalAlpha = 1),
                                n().draw(M.stockArea),
                                n().draw(M.foundationsArea),
                                n().draw(M.tableauArea),
                                n().draw(M.wasteArea),
                                n().drawFlip(),
                                n().drawFloat();
                        }
                    } else t.default.needsRedraw = !0;
                }),
                n().setDrawFn(n().drawGame),
                h().setRuleBook(A),
                m().setSpecificGameVars(M),
                c.default.setPriorities({
                    tableau_foundations: 6,
                    waste_foundations: 5,
                    tableau_tableau: 4,
                    waste_tableau: 3,
                    foundations_tableau: -1,
                    foundations_foundations: -1,
                }),
                c.default.setFlashMessage(
                    'Please <a id="hintChooseFromStock" class="ajaxlink text-white">choose from the stockpile</a>.'
                );
            let E = {
                loopDeal: function (e, t, a) {
                    return ('lt' == a && e < t) || ('gt' == a && e > t);
                },
                refillStock: function (e, a) {
                    if (!u().isLocked())
                        return new Promise(function (o) {
                            u().lock('deal');
                            let i,
                                r = gsap.timeline({
                                    onStart: function () {},
                                    onComplete: function () {
                                        n().sizeToFit(),
                                            n().drawGame(),
                                            u().unlock('deal'),
                                            (t.default.float = []),
                                            l.default.updateTurn(),
                                            l.default.updateStockCount(M.stockArea.piles[0].length),
                                            l.default.updatePassthroughs(),
                                            o();
                                    },
                                }),
                                s = {
                                    loopStart: 0,
                                    loopEnd: JSON.parse(
                                        JSON.stringify(M.wasteArea.piles[0].length)
                                    ),
                                    loopCondition: 'lt',
                                    from: M.wasteArea,
                                    fromPile: 0,
                                    to: M.stockArea,
                                    toPile: 0,
                                    rotationStart: 1,
                                    rotationEnd: 0,
                                    turnedUpStart: 1,
                                    turnedUpEnd: 0,
                                    direction: 1,
                                },
                                f = {
                                    loopStart: 0,
                                    loopEnd: JSON.parse(
                                        JSON.stringify(M.stockArea.piles[0].length)
                                    ),
                                    loopCondition: 'lt',
                                    from: M.stockArea,
                                    fromPile: 0,
                                    to: M.wasteArea,
                                    toPile: 0,
                                    rotationStart: 0,
                                    rotationEnd: 1,
                                    turnedUpStart: 0,
                                    turnedUpEnd: 1,
                                    direction: 1,
                                };
                            if (!e) {
                                let e = { to: f, from: s, type: 'refillStock' };
                                a || (d.default.addUndo(e), d.default.clearRedo());
                            }
                            i = e ? f : s;
                            let c = i.loopStart;
                            for (; E.loopDeal(c, i.loopEnd, i.loopCondition); ) {
                                let e = c,
                                    a = i.fromPile,
                                    o = i.toPile;
                                'loop' == i.fromPile && (a = e), 'loop' == i.toPile && (o = e);
                                let l = i.from.piles[a].pop(),
                                    s = 0;
                                void 0 !== i.to.cardXOffset &&
                                    (s = n().getExtraXOffset(i.to, a, e, i.loopEnd));
                                let d = 0;
                                void 0 !== i.from.cardXOffset &&
                                    (d = n().getExtraXOffset(i.from, a, e, i.loopEnd)),
                                    (l.position = {
                                        x: n().getXOffset(i.from, a) + d,
                                        xMax: n().getXOffset(i.to, o) + s,
                                        y:
                                            n().getYOffset(i.from, a) +
                                            n().setYOffset(
                                                i.from,
                                                i.from.piles[a].length * i.from.cardYOffset[a]
                                            ),
                                        yMax:
                                            n().getYOffset(i.to, o) +
                                            n().setYOffset(
                                                i.to,
                                                i.to.piles[o].length * i.to.cardYOffset[o]
                                            ),
                                        rotation: i.rotationStart,
                                    }),
                                    t.default.float.push(l),
                                    r.to(
                                        l.position,
                                        {
                                            duration: 0.15,
                                            ease: 'power1.out',
                                            x: l.position.xMax,
                                            y: l.position.yMax,
                                            rotation: i.rotationEnd,
                                            onStart: function () {
                                                (l.turnedup = i.turnedUpStart), audio.cardFlip();
                                            },
                                            onUpdate: function () {
                                                n().drawGame();
                                            },
                                            onComplete: function () {
                                                (l.turnedup = i.turnedUpEnd),
                                                    i.to.piles[o].push(l),
                                                    n().drawGame();
                                            },
                                        },
                                        '.1'
                                    ),
                                    (c += i.direction);
                            }
                        });
                },
                dealCards: function (e, a, o) {
                    if (!u().isLocked())
                        return new Promise(function (i) {
                            r().start();
                            const s = { start: Date.now(), undo: e, redo: a, action: 'deal' };
                            if (!e && 0 == M.stockArea.piles[0].length)
                                return x.default.logMove(s), void E.refillStock().then(i);
                            u().lock('deal');
                            let f = gsap.timeline({
                                    onStart: function () {},
                                    onComplete: function () {
                                        (t.default.float = []),
                                            n().sizeToFit(),
                                            n().drawGame(),
                                            u().unlock('deal'),
                                            l.default.updateTurn(),
                                            i();
                                    },
                                }),
                                c = numTurns,
                                p = M.stockArea.piles[0].length;
                            p < numTurns && (c = p),
                                e && (c = o.from.loopEnd),
                                (s.loopTurns = c),
                                x.default.logMove(s);
                            let m,
                                g = {
                                    loopStart: 0,
                                    loopEnd: c,
                                    loopCondition: 'lt',
                                    from: M.stockArea,
                                    fromPile: 0,
                                    to: M.wasteArea,
                                    toPile: 0,
                                    rotationStart: 0,
                                    rotationEnd: 1,
                                    turnedUpStart: 0,
                                    turnedUpEnd: 1,
                                    direction: 1,
                                },
                                h = {
                                    loopStart: 0,
                                    loopEnd: c,
                                    loopCondition: 'lt',
                                    from: M.wasteArea,
                                    fromPile: 0,
                                    to: M.stockArea,
                                    toPile: 0,
                                    rotationStart: 1,
                                    rotationEnd: 0,
                                    turnedUpStart: 1,
                                    turnedUpEnd: 0,
                                    direction: 1,
                                };
                            if (!e) {
                                let e = { to: h, from: g, type: 'deal' };
                                a || (d.default.addUndo(e), d.default.clearRedo());
                            }
                            m = e ? h : g;
                            let v = m.loopStart;
                            for (; E.loopDeal(v, m.loopEnd, m.loopCondition); ) {
                                let a = v,
                                    o = m.fromPile,
                                    i = m.toPile;
                                'loop' == m.fromPile && (o = a), 'loop' == m.toPile && (i = a);
                                let r = m.from.piles[o].pop();
                                if (void 0 === r) break;
                                let s = 0;
                                void 0 !== m.to.cardXOffset && (s = m.to.cardXOffset[o]);
                                let d = 0;
                                void 0 !== m.from.cardXOffset && (d = m.from.cardXOffset[o]);
                                let u = a;
                                e || (2 == p ? (u = a + 1) : 1 == p && (u = a + 2)),
                                    (r.position = {
                                        x: n().getXOffset(m.from, o) + u * d,
                                        xMax: n().getXOffset(m.to, i) + u * s,
                                        y:
                                            n().getYOffset(m.from, o) +
                                            n().setYOffset(
                                                m.from,
                                                m.from.piles[o].length * m.from.cardYOffset[o]
                                            ),
                                        yMax:
                                            n().getYOffset(m.to, i) +
                                            n().setYOffset(
                                                m.to,
                                                m.to.piles[i].length * m.to.cardYOffset[i]
                                            ),
                                        rotation: m.rotationStart,
                                    }),
                                    t.default.float.push(r),
                                    f.to(
                                        r.position,
                                        {
                                            duration: t.default.getDeltaRatioDuration(0.15),
                                            ease: 'power1.out',
                                            x: r.position.xMax,
                                            y: r.position.yMax,
                                            rotation: m.rotationEnd,
                                            onStart: function () {
                                                (r.turnedup = m.turnedUpStart), audio.cardFlip();
                                            },
                                            onUpdate: function () {
                                                n().drawGame();
                                            },
                                            onComplete: function () {
                                                (r.turnedup = m.turnedUpEnd),
                                                    m.to.piles[i].push(r),
                                                    n().drawGame(),
                                                    l.default.updateStockCount(
                                                        M.stockArea.piles[0].length
                                                    );
                                            },
                                        },
                                        0.02 * v
                                    ),
                                    (v += m.direction);
                            }
                        });
                },
            };
            s.Z.setRedealFn(E.dealCards),
                s.Z.setRefillStockFn(E.refillStock),
                (E.checkClick = function (e) {
                    if (
                        ('touchstart' == e.type
                            ? window.removeEventListener('mousedown', E.checkClick)
                            : 'mousedown' == e.type &&
                              window.removeEventListener('touchstart', E.checkClick),
                        u().isLocked())
                    )
                        return;
                    if ('canvas' !== e.target.id) return;
                    let t = u().getTargetFromEvent(e);
                    if (t && 'stock' == t.area.name) return r().start(), void E.dealCards();
                    u().drag(e);
                }),
                (E.checkStacks = function () {
                    let e = M.tableauArea.piles;
                    for (let t = 0; t < e.length; t++) {
                        let a,
                            o = 1;
                        for (let n = e[t].length - 1; n >= 0; n--) {
                            let i = e[t][n];
                            if (0 == i.turnedup) break;
                            if (i.number != o || 1 != o) {
                                if (i.suit !== a) break;
                                if (i.number !== o) break;
                                if (i.number != o || 13 === i.number) {
                                    if (i.number == o && 13 == i.number)
                                        return void E.moveToFoundation(t, !1);
                                } else o++;
                            } else o++, (a = i.suit);
                        }
                    }
                }),
                (E.moveToFoundation = function (e, a) {
                    let o = M.tableauArea.piles,
                        i = o[e].splice(-13),
                        r = null;
                    for (let e = 0; e < M.foundationsArea.piles.length; e++)
                        0 == M.foundationsArea.piles[e].length && (r = e);
                    if (!a) {
                        let t = {
                            to: { name: M.foundationsArea.name, pile: r, position: -1 },
                            from: { name: M.tableauArea.name, pile: e, position: o[e].length - 1 },
                            triggerNextUndo: !0,
                        };
                        d.default.addUndo(t), d.default.clearRedo();
                    }
                    let l = gsap.timeline({
                        onStart: function () {
                            u().lock('moveToFoundation');
                        },
                        onUpdate: function () {},
                        onComplete: function () {
                            n().sizeToFit(),
                                n().turnCardsUp(),
                                u().unlock('moveToFoundation'),
                                (t.default.float = []),
                                h().hasGameBeenWon() &&
                                    ((t.default.gameWon = !0), n().finishGame());
                        },
                    });
                    for (let a = i.length - 1; a >= 0; a--) {
                        let o = i[a];
                        (o.position = {
                            x: n().getXOffset(M.tableauArea, e),
                            xMax: n().getXOffset(M.foundationsArea, r),
                            y:
                                n().getYOffset(M.tableauArea, e) +
                                n().setYOffset(
                                    M.tableauArea,
                                    (M.tableauArea.piles[e].length + a) *
                                        M.tableauArea.cardYOffset[e]
                                ),
                            yMax: n().getYOffset(M.foundationsArea, r),
                            rotation: 1,
                        }),
                            t.default.float.unshift(o),
                            l.to(
                                o.position,
                                {
                                    duration: 0.25,
                                    ease: 'power1.out',
                                    x: o.position.xMax,
                                    y: o.position.yMax,
                                    onStart: function () {
                                        audio.cardFlip();
                                    },
                                    onUpdate: function () {
                                        n().drawGame();
                                    },
                                    onComplete: function () {
                                        M.foundationsArea.piles[r].push(t.default.float.shift());
                                    },
                                },
                                0.1
                            );
                    }
                }),
                (M.actionWeight = function (e) {
                    return e.area.toWeight;
                }),
                u().setWeightFn(M.actionWeight);
            let _ = !1;
            function F(e) {
                if (!(0, b.modalOnScreen)())
                    if (u().isLocked()) e.preventDefault();
                    else if (0 === t.default.float.length)
                        switch (e.key) {
                            case ' ':
                                (0, S.hotKeyUsedInGame)(e.key), e.preventDefault(), E.dealCards();
                                break;
                            case 'w':
                            case 'Enter':
                            case 's':
                                (0, S.hotKeyUsedInGame)(e.key),
                                    e.preventDefault(),
                                    c.default.showHint(!0);
                                break;
                            case 'a':
                            case 'u':
                                (0, S.hotKeyUsedInGame)(e.key),
                                    e.preventDefault(),
                                    d.default.undo();
                                break;
                            case 'd':
                                (0, S.hotKeyUsedInGame)(e.key),
                                    e.preventDefault(),
                                    d.default.redo();
                                break;
                            case 'r':
                                if (e.metaKey || e.altKey || e.shiftKey || e.ctrlKey) break;
                                (0, S.hotKeyUsedInGame)(e.key),
                                    e.preventDefault(),
                                    d.default.redo();
                                break;
                            case '?':
                            case 'h':
                                (0, S.hotKeyUsedInGame)(e.key),
                                    e.preventDefault(),
                                    $('#hotkeys-modal').modal('show');
                        }
                    else e.preventDefault();
            }
            window.addEventListener('gameVars.imagesLoaded', function () {
                _ ||
                    (gsap.ticker.add(function () {
                        n().drawGame(!0);
                    }),
                    n().drawGame(),
                    (_ = !0));
            }),
                window.addEventListener('touchstart', E.checkClick),
                window.addEventListener('mousedown', E.checkClick),
                window.addEventListener('mouseup', u().drop),
                window.addEventListener('touchend', u().drop),
                window.addEventListener(
                    'contextmenu',
                    function (e) {
                        if ('canvas' == e.target.id) return e.preventDefault(), !1;
                    },
                    !1
                ),
                window.addEventListener('gameVars.dropCompleted', E.checkStacks),
                window.addEventListener('gameVars.congratsNextCardEvent', n().waterfall),
                window.addEventListener('gameVars.animateDeal', s.Z.animateDeal),
                window.addEventListener('gameVars.triggerNextUndo', d.default.undo),
                window.addEventListener('registerModalCloseEvent', v.default.triggerHighScores),
                window.addEventListener('loginModalCloseEvent', v.default.triggerHighScores),
                e.default.set(
                    document.querySelector('.stopwatch'),
                    document.querySelector('.results')
                ),
                n().sizeToFit(),
                n().redrawImages(),
                (t.default.globalWindow.width = window.innerWidth),
                (t.default.globalWindow.height = window.innerHeight),
                $('#undoBtn').on('click', function () {
                    d.default.undo();
                }),
                $('#redoBtn').on('click', function () {
                    d.default.redo();
                }),
                $('#hintBtn').on('click', function () {
                    c.default.showHint();
                }),
                $('body').on('click', '#hintChooseFromStock', function () {
                    E.dealCards();
                }),
                $(window).on('resize', function () {
                    if (
                        window.innerWidth == t.default.globalWindow.width &&
                        window.innerHeight == t.default.globalWindow.height
                    )
                        return;
                    let e = window.innerWidth / t.default.globalWindow.width,
                        a = window.innerHeight / t.default.globalWindow.height;
                    (e > 0.95 && e < 1.05 && a > 0.8 && a < 1.1) ||
                        (n().sizeToFit(),
                        n().redrawImages(),
                        (t.default.globalWindow.width = window.innerWidth),
                        (t.default.globalWindow.height = window.innerHeight));
                });
            let P = !1;
            window.addEventListener('gameVars.dealAnimationFinished', function () {
                if (!P) {
                    let e;
                    P = !0;
                    try {
                        (e = localStorage.getItem(t.default.storageKey)), (e = JSON.parse(e));
                    } catch (t) {
                        e = null;
                    }
                    e && (t.default.movesData = e),
                        (v.default.seedSaved || location.search.indexOf('resume=') >= 0) &&
                            t.default.movesData &&
                            (u().lock('init'),
                            (t.default.isReplay = !0),
                            setTimeout(
                                T(
                                    k().mark(function e() {
                                        return k().wrap(function (e) {
                                            for (;;)
                                                switch ((e.prev = e.next)) {
                                                    case 0:
                                                        return (
                                                            u().unlock('init'),
                                                            r().restart(),
                                                            (e.next = 4),
                                                            u().completeMoves(
                                                                t.default.movesData,
                                                                E.dealCards
                                                            )
                                                        );
                                                    case 4:
                                                        r().stop(),
                                                            (t.default.isReplay = !1),
                                                            h().hasGameBeenWon() &&
                                                                ((t.default.gameWon = !0),
                                                                n().waterfall());
                                                    case 7:
                                                    case 'end':
                                                        return e.stop();
                                                }
                                        }, e);
                                    })
                                ),
                                2e3
                            )),
                        document.addEventListener('keydown', F);
                }
            });
            let D = !1;
            (0, b.onIdle)(15e3, function () {
                D ||
                    (0, b.modalOnScreen)() ||
                    ((D = !0),
                    t.default.gameWon ||
                        ($('#hintBtn').tooltip({
                            title: 'If you get stuck, try a hint!',
                            placement: 'bottom',
                            trigger: 'manual',
                        }),
                        setTimeout(function () {
                            $('#hintBtn').tooltip('show'),
                                setTimeout(function () {
                                    $('#hintBtn').tooltip('hide');
                                }, 4e3);
                        }, 1e3)));
            }),
                (window.customize = y),
                $(function () {
                    $('#seed-stats-win-perc').on('mouseover', function () {
                        (0, S.seedStatsInteraction)('mouseover');
                    }),
                        $('#seed-stats-win-perc').on('click', function () {
                            (0, S.seedStatsInteraction)('click'),
                                $('#seed-stats-win-perc').tooltip({
                                    title: 'Calculated from games of all players for this deal.',
                                    placement: 'top',
                                    trigger: 'manual',
                                }),
                                $('#seed-stats-win-perc').tooltip('show'),
                                setTimeout(function () {
                                    $('#seed-stats-win-perc').tooltip('hide');
                                }, 2500);
                        });
                });
        })();
})();

/**
 * 国际化(i18n)模块 - 实现多语言支持
 */
class I18n {
    constructor() {
        // 默认语言
        this.defaultLanguage = 'zh-CN';
        // 当前语言
        this.currentLanguage = this.getSavedLanguage() || this.detectBrowserLanguage() || this.defaultLanguage;
        // 可用语言列表
        this.availableLanguages = [
            { code: 'zh-CN', name: '简体中文', dir: 'ltr' },
            { code: 'zh-TW', name: '繁體中文', dir: 'ltr' },
            { code: 'en', name: 'English', dir: 'ltr' },
            { code: 'fr', name: 'Français', dir: 'ltr' },
            { code: 'de', name: 'Deutsch', dir: 'ltr' },
            { code: 'ja', name: '日本語', dir: 'ltr' },
            { code: 'ko', name: '한국어', dir: 'ltr' },
            { code: 'es', name: 'Español', dir: 'ltr' },
            { code: 'ru', name: 'Русский', dir: 'ltr' },
            { code: 'pt', name: 'Português', dir: 'ltr' },
            { code: 'ar', name: 'العربية', dir: 'rtl' },
            { code: 'vi', name: 'Tiếng Việt', dir: 'ltr' }
        ];

        // 初始化应用
        document.addEventListener('DOMContentLoaded', () => {
            // 在DOM加载完成后添加noScores翻译键，确保this.translations已经初始化
            this.addNoScoresTranslation();
            this.init();
        });
    }

    /**
     * 添加noScores翻译键
     */
    addNoScoresTranslation() {
        // 确保translations已经初始化
        if (!this.translations) {
            console.warn('无法添加noScores翻译，translations尚未初始化');
            return;
        }

        // 为所有语言添加noScores翻译
        Object.keys(this.translations).forEach(lang => {
            // 检查语言对象是否存在
            if (this.translations[lang] && !this.translations[lang].noScores) {
                switch(lang) {
                    case 'zh-CN':
                        this.translations[lang].noScores = '暂无记录';
                        break;
                    case 'zh-TW':
                        this.translations[lang].noScores = '暫無記錄';
                        break;
                    case 'en':
                        this.translations[lang].noScores = 'No records yet';
                        break;
                    case 'fr':
                        this.translations[lang].noScores = 'Pas encore de records';
                        break;
                    case 'de':
                        this.translations[lang].noScores = 'Noch keine Aufzeichnungen';
                        break;
                    case 'ja':
                        this.translations[lang].noScores = '記録なし';
                        break;
                    case 'ko':
                        this.translations[lang].noScores = '기록이 없습니다';
                        break;
                    case 'es':
                        this.translations[lang].noScores = 'Sin registros aún';
                        break;
                    case 'ru':
                        this.translations[lang].noScores = 'Пока нет записей';
                        break;
                    case 'pt':
                        this.translations[lang].noScores = 'Ainda sem registros';
                        break;
                    case 'ar':
                        this.translations[lang].noScores = 'لا توجد سجلات بعد';
                        break;
                    case 'vi':
                        this.translations[lang].noScores = 'Chưa có bản ghi nào';
                        break;
                    default:
                        this.translations[lang].noScores = 'No records yet';
                }
            }
        });
    }
    
    /**
     * 初始化国际化设置
     */
    init() {
        // 设置文档语言和方向
        document.documentElement.lang = this.currentLanguage;
        const langData = this.availableLanguages.find(lang => lang.code === this.currentLanguage);
        document.documentElement.dir = langData ? langData.dir : 'ltr';
        
        // 设置RTL样式
        const rtlStylesheet = document.getElementById('rtl-style');
        if (rtlStylesheet) {
            rtlStylesheet.disabled = langData?.dir !== 'rtl';
        }
        
        // 应用翻译
        this.updateTranslations();
        
        // 我们将绑定操作移到setTimeout中以确保DOM完全加载
        setTimeout(() => {
            // 设置语言选择器
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = this.currentLanguage;
            } else {
                console.warn('语言选择器元素不存在');
            }
            
            // 直接绑定Apply按钮事件，确保this指向正确
            const applyLanguageBtn = document.getElementById('apply-language');
            if (applyLanguageBtn) {
                // 存储this引用
                const self = this;
                
                // 绑定点击事件
                applyLanguageBtn.onclick = function() {
                    const select = document.getElementById('language-select');
                    if (select) {
                        const newLang = select.value;
                        self.changeLanguage(newLang);
                        if (window.audioManager) {
                            window.audioManager.playButtonSound();
                        }
                        // 使用翻译消息
                        alert(self.t('languageChanged') + newLang);
                    }
                };
            } else {
                console.warn('语言应用按钮元素不存在');
            }
        }, 500); // 延迟500ms确保DOM已完全加载
    }
    
    /**
     * 获取保存的语言设置
     */
    getSavedLanguage() {
        return localStorage.getItem('snakeGameLanguage');
    }
    
    /**
     * 检测浏览器语言
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const supportedLang = this.availableLanguages.find(lang => 
            browserLang.startsWith(lang.code) || lang.code.startsWith(browserLang)
        );
        return supportedLang ? supportedLang.code : null;
    }
    
    /**
     * 切换语言
     * @param {string} langCode - 语言代码
     */
    changeLanguage(langCode) {
        if (this.availableLanguages.some(lang => lang.code === langCode)) {
            this.currentLanguage = langCode;
            localStorage.setItem('snakeGameLanguage', langCode);
            
            // 设置文档语言和方向
            document.documentElement.lang = this.currentLanguage;
            const langData = this.availableLanguages.find(lang => lang.code === this.currentLanguage);
            document.documentElement.dir = langData ? langData.dir : 'ltr';
            
            // 设置RTL样式
            const rtlStylesheet = document.getElementById('rtl-style');
            if (rtlStylesheet) {
                rtlStylesheet.disabled = langData?.dir !== 'rtl';
            }
            
            // 更新翻译
            this.updateTranslations();
            
            return true;
        }
        return false;
    }
    
    /**
     * 获取翻译字符串
     * @param {string} key - 翻译键名
     * @returns {string} 翻译后的字符串
     */
    t(key) {
        const translations = this.translations[this.currentLanguage] || this.translations[this.defaultLanguage];
        return translations[key] || key;
    }
    
    /**
     * 更新页面上的所有翻译
     */
    updateTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                element.textContent = this.t(key);
            }
        });
        
        // 更新选择菜单中的选项文本
        document.querySelectorAll('option[data-i18n]').forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (key) {
                option.textContent = this.t(key);
            }
        });
    }

    // 语言资源对象
    translations = {
        'zh-CN': {
            // 通用
            'start': '开始游戏',
            'settings': '设置',
            'highScores': '最高分',
            'back': '返回',
            'apply': '应用',
            'languageChanged': '语言已切换到: ',
            
            // 游戏状态
            'score': '分数',
            'best': '最高',
            'pause': '暂停',
            'paused': '已暂停',
            'resume': '继续',
            'restart': '重新开始',
            'exit': '退出',
            'gameOver': '游戏结束',
            'finalScore': '最终分数',
            'newHighScore': '新纪录！',
            'playAgain': '再玩一次',
            'mainMenu': '主菜单',
            'noScores': '暂无记录',
            
            // 设置
            'language': '语言',
            'difficulty': '难度',
            'easy': '简单',
            'medium': '中等',
            'hard': '困难',
            'sound': '音效',
            'theme': '主题',
            'apply': '应用'
        },
        'zh-TW': {
            'start': '開始遊戲',
            'settings': '設置',
            'highScores': '最高分',
            'back': '返回',
            'score': '分數',
            'best': '最高',
            'pause': '暫停',
            'paused': '已暫停',
            'resume': '繼續',
            'restart': '重新開始',
            'exit': '退出',
            'gameOver': '遊戲結束',
            'finalScore': '最終分數',
            'newHighScore': '新紀錄！',
            'playAgain': '再玩一次',
            'mainMenu': '主菜單',
            'noScores': '暫無記錄',
            'language': '語言',
            'difficulty': '難度',
            'easy': '簡單',
            'medium': '中等',
            'hard': '困難',
            'sound': '音效',
            'theme': '主題',
            'apply': '應用',
            'languageChanged': '語言已切換到: '
        },
        'en': {
            'start': 'Start Game',
            'settings': 'Settings',
            'highScores': 'High Scores',
            'back': 'Back',
            'score': 'Score',
            'best': 'Best',
            'pause': 'Pause',
            'paused': 'Paused',
            'resume': 'Resume',
            'restart': 'Restart',
            'exit': 'Exit',
            'gameOver': 'Game Over',
            'finalScore': 'Final Score',
            'newHighScore': 'New High Score!',
            'playAgain': 'Play Again',
            'mainMenu': 'Main Menu',
            'noScores': 'No records yet',
            'language': 'Language',
            'difficulty': 'Difficulty',
            'easy': 'Easy',
            'medium': 'Medium',
            'hard': 'Hard',
            'sound': 'Sound',
            'theme': 'Theme',
            'apply': 'Apply',
            'languageChanged': 'Language changed to: '
        },
        'fr': {
            'start': 'Commencer',
            'settings': 'Paramètres',
            'highScores': 'Meilleurs Scores',
            'back': 'Retour',
            'score': 'Score',
            'best': 'Meilleur',
            'pause': 'Pause',
            'paused': 'En Pause',
            'resume': 'Continuer',
            'restart': 'Recommencer',
            'exit': 'Quitter',
            'gameOver': 'Partie Terminée',
            'finalScore': 'Score Final',
            'newHighScore': 'Nouveau Record !',
            'playAgain': 'Rejouer',
            'mainMenu': 'Menu Principal',
            'noScores': 'Pas encore de records',
            'language': 'Langue',
            'difficulty': 'Difficulté',
            'easy': 'Facile',
            'medium': 'Moyen',
            'hard': 'Difficile',
            'sound': 'Son',
            'theme': 'Thème',
            'apply': 'Appliquer',
            'languageChanged': 'Langue changée en: '
        },
        'de': {
            'start': 'Spiel Starten',
            'settings': 'Einstellungen',
            'highScores': 'Bestenliste',
            'back': 'Zurück',
            'score': 'Punkte',
            'best': 'Beste',
            'pause': 'Pause',
            'paused': 'Pausiert',
            'resume': 'Fortsetzen',
            'restart': 'Neustart',
            'exit': 'Beenden',
            'gameOver': 'Spiel Vorbei',
            'finalScore': 'Endpunktzahl',
            'newHighScore': 'Neuer Rekord!',
            'playAgain': 'Nochmal Spielen',
            'mainMenu': 'Hauptmenü',
            'noScores': 'Noch keine Aufzeichnungen',
            'language': 'Sprache',
            'difficulty': 'Schwierigkeit',
            'easy': 'Einfach',
            'medium': 'Mittel',
            'hard': 'Schwer',
            'sound': 'Ton',
            'theme': 'Design',
            'apply': 'Anwenden',
            'languageChanged': 'Sprache geändert zu: '
        },
        'ja': {
            'start': 'ゲーム開始',
            'settings': '設定',
            'highScores': '高得点',
            'back': '戻る',
            'score': 'スコア',
            'best': '最高',
            'pause': '一時停止',
            'paused': '停止中',
            'resume': '再開',
            'restart': 'リスタート',
            'exit': '終了',
            'gameOver': 'ゲームオーバー',
            'finalScore': '最終スコア',
            'newHighScore': '新記録！',
            'playAgain': 'もう一度',
            'mainMenu': 'メインメニュー',
            'noScores': '記録なし',
            'language': '言語',
            'difficulty': '難易度',
            'easy': '簡単',
            'medium': '普通',
            'hard': '難しい',
            'sound': '音楽',
            'theme': 'テーマ',
            'apply': '適用',
            'languageChanged': '言語が変更されました: '
        },
        'ko': {
            'start': '게임 시작',
            'settings': '설정',
            'highScores': '최고 점수',
            'back': '뒤로',
            'score': '점수',
            'best': '최고',
            'pause': '일시정지',
            'paused': '일시정지됨',
            'resume': '계속하기',
            'restart': '재시작',
            'exit': '종료',
            'gameOver': '게임 오버',
            'finalScore': '최종 점수',
            'newHighScore': '새 기록!',
            'playAgain': '다시 하기',
            'mainMenu': '메인 메뉴',
            'noScores': '기록이 없습니다',
            'language': '언어',
            'difficulty': '난이도',
            'easy': '쉬움',
            'medium': '보통',
            'hard': '어려움',
            'sound': '소리',
            'theme': '테마',
            'apply': '적용',
            'languageChanged': '언어가 변경되었습니다: '
        },
        'es': {
            'start': 'Iniciar Juego',
            'settings': 'Configuración',
            'highScores': 'Puntuaciones Altas',
            'back': 'Volver',
            'score': 'Puntuación',
            'best': 'Mejor',
            'pause': 'Pausa',
            'paused': 'Pausado',
            'resume': 'Continuar',
            'restart': 'Reiniciar',
            'exit': 'Salir',
            'gameOver': 'Juego Terminado',
            'finalScore': 'Puntuación Final',
            'newHighScore': '¡Nuevo Récord!',
            'playAgain': 'Jugar de Nuevo',
            'mainMenu': 'Menú Principal',
            'noScores': 'Sin registros aún',
            'language': 'Idioma',
            'difficulty': 'Dificultad',
            'easy': 'Fácil',
            'medium': 'Medio',
            'hard': 'Difícil',
            'sound': 'Sonido',
            'theme': 'Tema',
            'apply': 'Aplicar',
            'languageChanged': 'Idioma cambiado a: '
        },
        'ru': {
            'start': 'Начать Игру',
            'settings': 'Настройки',
            'highScores': 'Рекорды',
            'back': 'Назад',
            'score': 'Счет',
            'best': 'Рекорд',
            'pause': 'Пауза',
            'paused': 'Приостановлено',
            'resume': 'Продолжить',
            'restart': 'Перезапуск',
            'exit': 'Выход',
            'gameOver': 'Игра Окончена',
            'finalScore': 'Финальный Счет',
            'newHighScore': 'Новый Рекорд!',
            'playAgain': 'Играть Снова',
            'mainMenu': 'Главное Меню',
            'noScores': 'Пока нет записей',
            'language': 'Язык',
            'difficulty': 'Сложность',
            'easy': 'Легкий',
            'medium': 'Средний',
            'hard': 'Сложный',
            'sound': 'Звук',
            'theme': 'Тема',
            'apply': 'Применить',
            'languageChanged': 'Язык изменен на: '
        },
        'pt': {
            'start': 'Iniciar Jogo',
            'settings': 'Configurações',
            'highScores': 'Melhores Pontuações',
            'back': 'Voltar',
            'score': 'Pontuação',
            'best': 'Melhor',
            'pause': 'Pausa',
            'paused': 'Pausado',
            'resume': 'Continuar',
            'restart': 'Reiniciar',
            'exit': 'Sair',
            'gameOver': 'Fim de Jogo',
            'finalScore': 'Pontuação Final',
            'newHighScore': 'Novo Recorde!',
            'playAgain': 'Jogar Novamente',
            'mainMenu': 'Menu Principal',
            'noScores': 'Ainda sem registros',
            'language': 'Idioma',
            'difficulty': 'Dificuldade',
            'easy': 'Fácil',
            'medium': 'Médio',
            'hard': 'Difícil',
            'sound': 'Som',
            'theme': 'Tema',
            'apply': 'Aplicar',
            'languageChanged': 'Idioma alterado para: '
        },
        'ar': {
            'start': 'ابدأ اللعبة',
            'settings': 'الإعدادات',
            'highScores': 'أعلى النقاط',
            'back': 'رجوع',
            'score': 'النقاط',
            'best': 'الأفضل',
            'pause': 'إيقاف مؤقت',
            'paused': 'متوقف',
            'resume': 'استمرار',
            'restart': 'إعادة تشغيل',
            'exit': 'خروج',
            'gameOver': 'انتهت اللعبة',
            'finalScore': 'النتيجة النهائية',
            'newHighScore': 'رقم قياسي جديد!',
            'playAgain': 'العب مرة أخرى',
            'mainMenu': 'القائمة الرئيسية',
            'noScores': 'لا توجد سجلات بعد',
            'language': 'اللغة',
            'difficulty': 'الصعوبة',
            'easy': 'سهل',
            'medium': 'متوسط',
            'hard': 'صعب',
            'sound': 'الصوت',
            'theme': 'السمة',
            'apply': 'تطبيق',
            'languageChanged': 'تم تغيير اللغة إلى: '
        },
        'vi': {
            'start': 'Bắt Đầu',
            'settings': 'Cài Đặt',
            'highScores': 'Điểm Cao',
            'back': 'Quay Lại',
            'score': 'Điểm',
            'best': 'Cao Nhất',
            'pause': 'Tạm Dừng',
            'paused': 'Đã Tạm Dừng',
            'resume': 'Tiếp Tục',
            'restart': 'Bắt Đầu Lại',
            'exit': 'Thoát',
            'gameOver': 'Kết Thúc',
            'finalScore': 'Điểm Cuối Cùng',
            'newHighScore': 'Kỷ Lục Mới!',
            'playAgain': 'Chơi Lại',
            'mainMenu': 'Menu Chính',
            'noScores': 'Chưa có bản ghi nào',
            'language': 'Ngôn Ngữ',
            'difficulty': 'Độ Khó',
            'easy': 'Dễ',
            'medium': 'Trung Bình',
            'hard': 'Khó',
            'sound': 'Âm Thanh',
            'theme': 'Giao Diện',
            'apply': 'Áp dụng',
            'languageChanged': 'Đã chuyển ngôn ngữ sang: '
        }
    };
}

// 创建全局i18n实例
window.i18n = new I18n();

export const zshContent = `# Set the default user prompt
export PS1='%n@%m:%~%# '

# Set Zsh options
setopt autocd
setopt notify
setopt correct

# Aliases
alias ll='ls -lah'
alias gs='git status'
alias gp='git pull'
alias gc='git commit -m'

# Path modifications
export PATH="$HOME/bin:$PATH"

# Load plugins
source $HOME/.zsh_plugins

# Enable syntax highlighting
if [ -f /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh ]; then
  source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
fi

# History configuration
HISTFILE=~/.zsh_history
HISTSIZE=1000
SAVEHIST=1000

# Custom functions
mkcd() {
  mkdir -p "$1" && cd "$1"
}`;

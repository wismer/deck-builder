Rails.application.routes.draw do

  devise_for :users
  root to: 'home#index'

  get 'expansions/list' => 'expansions#set_list'
  get 'expansions/expansion/:code' => 'expansions#code'
  get 'expansions/card_filter' => 'expansions#filter_cards'
  get 'cards/query' => 'cards#list'
  get 'cards/filtered' => 'cards#filtered'
  get 'decks/new' => 'decks#new'
  get 'decks' => 'decks#index'
  post 'decks' => 'decks#create'
end

class DecksController < ApplicationController
  def index
    @decks = Deck.where(user_params).map { |deck| deck.all_cards }

    respond_to do |format|
      format.json { render json: @decks }
    end
  end

  def new
    @deck = Deck.create(user_params)
    @expansion_cards = Card.where(expansion_params)

    respond_to do |format|
      format.json { render json: { deck: @deck.id, cards: @expansion_cards } }
    end
  end

  def create
    @deck = Deck.find(params[:deck])
    card_params[:player_cards].each do |n, card|
      PlayerCard.create(card)
    end

    respond_to do |format|
      format.json { render json: { msg: "saved!" } }
    end
  end


  private

  def expansion_params
    params.require(:expansions).permit(expansion_id: [])
  end

  def user_params
    params.require(:user).permit(:user_id, :name)
  end

  def card_params
    params.require(:cards).permit(:deck, :player_cards => [:card_id, :deck_id, :count])
  end
end

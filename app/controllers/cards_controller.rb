class CardsController < ApplicationController
  def search
    @cards = Card.where(query_params).sort_by { |card| card.name }

    respond_to do |format|
      format.json { render json: @cards }
    end
  end

  def filtered
    @cards = Card.where(query_params)

    respond_to do |format|
      format.json { render json: @cards }
    end
  end

  def list
    @cards = Card.where(list_params)

    respond_to do |format|
      format.json { render json: @cards }
    end
  end

  private

  def query_params
    params.require(:cards).permit(
      expansion_id: [],
      card_colors: [],
      card_type: []
    )
  end

  def list_params
    params.require(:expansions).permit(expansion_id: [])
  end
end

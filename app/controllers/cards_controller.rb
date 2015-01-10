class CardsController < ApplicationController
  def search
    @cards = Card.where(query_params)

    respond_to do |format|
      format.json { render json: @cards }
    end
  end

  private

  def query_params
    params.require(:filter).permit({ card_colors: [] }, { expansion_id: [] })
  end
end
